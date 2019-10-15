const express = require("express");
const path = require("path");
const fs = require("fs-extra");
const bodyParser = require("body-parser");

const utils = require("./utils/index");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// declare color_vars variable
let COLOR_VARS;

// API calls

app.get("/api/colors", async (req, res) => {
  // get colors from GitHub
  let COLOR_VARS = await utils.fetchColors();

  try {
    // parse and sent to client
    let colors = utils.parseResponse(COLOR_VARS);
    res.send(colors);
  } catch (e) {
    console.log("ERROR", e);
  }
});

app.post("/api/colors", async (req, res) => {
  // get custom colors obj from client form
  const customColors = req.body;

  // get COLOR_VARS if not fetched
  if (!COLOR_VARS) COLOR_VARS = await utils.fetchColors();

  // process custom colors
  if (customColors) {
    // rewrite changed colors
    COLOR_VARS = await utils.rewriteColors(customColors, COLOR_VARS);
  }

  // download - unzip - extract scss - delete rest in a TMP folder
  const tmpPath = await utils.downloadMasterZip();

  // create new colors_vars.scss
  const zipFolderPath = await utils.writeNewColorsVars(tmpPath, COLOR_VARS);

  // zip folder and download
  const zipFilePath = await utils.zipCssAndSave(zipFolderPath);

  // send download response to client
  res.download(zipFilePath, zipFilePath.split("/").pop(), async err => {
    await fs.remove(tmpPath);
  });

  // console.log("END");
});

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "client/build")));

  // Handle React routing, return all requests to React app
  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
