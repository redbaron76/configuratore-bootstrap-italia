const includes = require("lodash/includes");
const isArray = require("lodash/isArray");
const wget = require("node-wget-promise");
const fetch = require("node-fetch");
const AdmZip = require("adm-zip");
const sass = require("node-sass-promise");
const fs = require("fs-extra");
const Colr = require("colr");

exports.COLORS = ["primary-h", "primary-s", "primary-b"];

exports.fetchColors = async () => {
  const content = await fetch(
    "https://raw.githubusercontent.com/italia/bootstrap-italia/master/src/scss/utilities/colors_vars.scss"
  );
  return await content.text();
};

exports.downloadMasterZip = async () => {
  const masterZipUrl =
    "https://github.com/italia/bootstrap-italia/archive/master.zip";

  try {
    // create /public folder if not present
    await fs.ensureDir(__dirname + "/../public", { mode: 777 });
    // create file name
    const folderName = new Date().getTime();
    const fileName = folderName + ".zip";
    const outputDir = __dirname + "/../public/" + fileName;
    await wget(masterZipUrl, {
      output: outputDir
    });

    return await this.unzipMasterZip(
      outputDir,
      __dirname + "/../public/" + folderName
    );
  } catch (e) {
    console.log("downloadMasterZip ERR", e);
  }
};

exports.unzipMasterZip = async (filePath, unzipFolder) => {
  const zip = new AdmZip(filePath);
  // extract to unzip folder
  await zip.extractAllTo(unzipFolder, true);
  // remove downloaded zip file
  await fs.unlink(filePath);
  // move the scss folder out of bootstrap folder
  return await this.moveScssFolderOut(unzipFolder);
};

exports.moveScssFolderOut = async path => {
  // copy scss folder out in a TMP folder
  await fs.copy(path + "/bootstrap-italia-master/src/scss", path + "/scss");
  // remove the rest
  await fs.remove(path + "/bootstrap-italia-master");
  // return output path
  return path;
};

exports.writeNewColorsVars = async (path, colorsBuffer) => {
  // rename colors_vars.scss to colors_vars_ORIGINAL.scss
  await fs.move(
    path + "/scss/utilities/colors_vars.scss",
    path + "/scss/utilities/colors_vars_ORIGINAL.scss"
  );

  // create new colors_vars.scss with COLOR_VARS values
  await fs.writeFile(path + "/scss/utilities/colors_vars.scss", colorsBuffer);

  return await this.compileNodeSass(path);
};

exports.compileNodeSass = async path => {
  const scssEntryPath = path + "/scss/bootstrap-italia.scss";
  const cssOutputPath = path + "/css";

  const compiled = await sass.render({
    file: scssEntryPath,
    outputStyle: "compressed",
    sourceMap: true,
    outFile: cssOutputPath,
    includePaths: ["../node_modules"]
  });

  await fs.ensureDir(cssOutputPath);
  await fs.writeFile(cssOutputPath + "/bootstrap-italia.min.css", compiled.css);
  await fs.writeFile(
    cssOutputPath + "/bootstrap-italia.min.css.map",
    compiled.map
  );

  return cssOutputPath;
};

exports.zipCssAndSave = async zipPath => {
  // create and add files to zip
  const zip = new AdmZip();
  await zip.addLocalFolder(zipPath);
  // save zip file
  await zip.writeZip(zipPath + "/bootstrap-italia-custom-css.zip");
  // return the zip path
  return zipPath + "/bootstrap-italia-custom-css.zip";
};

exports.rewriteColors = async (customColors, newColorVars) => {
  Object.keys(customColors).forEach(key => {
    if (key && isArray(customColors[key].hsb)) {
      let oldHSBarr = customColors[key].hsb;
      let newHSBarr = this.hexToHSB(customColors[key].hex);

      if (key === "primary") {
        newColorVars = newColorVars.replace(
          `$primary-h: ${oldHSBarr[0]} !default;`,
          `$primary-h: ${newHSBarr[0]} !default;`
        );
        newColorVars = newColorVars.replace(
          `$primary-s: ${oldHSBarr[1]} !default;`,
          `$primary-s: ${newHSBarr[1]} !default;`
        );
        newColorVars = newColorVars.replace(
          `$primary-b: ${oldHSBarr[2]} !default;`,
          `$primary-b: ${newHSBarr[2]} !default;`
        );
      } else {
        newColorVars = newColorVars.replace(
          `$${key}: ${oldHSBarr.join(", ")} !default;`,
          `$${key}: ${newHSBarr.join(", ")} !default;`
        );
      }
    }
  });

  return newColorVars;
};

exports.parsePrimary = arr => {
  let primaryHSB = [];
  arr.forEach(str => {
    if (str.startsWith("primary-")) {
      let arr = str.split(" ");
      primaryHSB.push(parseInt(arr[1]));
    }
  });

  arr.unshift(`primary: hsb(${primaryHSB.join(", ")}) !default;\n`);

  return arr.filter(str => {
    return !str.startsWith("primary-");
  });
};

exports.parseResponse = text => {
  let arr = text.split("$").filter(str => {
    let key = str.split(":")[0];
    return includes(this.COLORS, key);
  });

  const customColors = {};

  arr = this.parsePrimary(arr)
    .map(str => {
      let arr = str.split(" ");
      let key = arr[0].replace(":", "");
      let hsb = str
        .substring(str.lastIndexOf("(") + 1, str.lastIndexOf(")"))
        .split(", ")
        .map(n => parseInt(n));
      return {
        key,
        hsb,
        hex: this.hsbToHex(hsb)
      };
    })
    .forEach(c => {
      customColors[c.key] = {
        hsb: c.hsb,
        hex: c.hex
      };
    });

  return customColors;
};

exports.hsbToHex = hsb => {
  if (isArray(hsb)) {
    const colr = Colr().fromHsvArray(hsb);
    return colr.toHex();
  }
};

exports.hexToHSB = hex => {
  if (hex && hex.length >= 3) {
    const colr = Colr().fromHex(hex.replace("#", ""));
    return colr.toHsvArray();
  }
};
