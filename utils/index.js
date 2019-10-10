const includes = require("lodash/includes");
const Colr = require("colr");

exports.COLORS = ["primary-h", "primary-s", "primary-b"];

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
  console.log(text);
  let arr = text.split("$").filter(str => {
    let key = str.split(":")[0];
    return includes(this.COLORS, key);
  });

  const colors = {};

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
      colors[c.key] = {
        hsb: c.hsb,
        hex: c.hex
      };
    });

  return colors;
};

exports.hsbToHex = hsb => {
  const colr = Colr().fromHsvArray(hsb);
  return colr.toHex();
};

exports.hexToHSB = hex => {
  const colr = Colr().fromHex(hex.replace("#", ""));
  return colr.toHsvArray;
};
