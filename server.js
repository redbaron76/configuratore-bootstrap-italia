const express = require("express");
const path = require("path");
const fs = require("fs-extra");
const bodyParser = require("body-parser");

const utils = require("./utils/index");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
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
  if (!COLOR_VARS) {
    io.emit("status", {
      type: "fetching",
      data: {
        text: "Scarico la palette predefinita da GitHub...",
        icon: false
      }
    });

    COLOR_VARS = await utils.fetchColors();

    io.emit("status", {
      type: "fetching",
      data: {
        text: "Scarico la palette predefinita da GitHub",
        icon: true
      }
    });
  }

  // process custom colors
  if (customColors) {
    io.emit("status", {
      type: "rewriting",
      data: {
        text: "Applico la nuova palette colori impostata...",
        icon: false
      }
    });

    // rewrite changed colors
    COLOR_VARS = await utils.rewriteColors(customColors, COLOR_VARS);

    io.emit("status", {
      type: "rewriting",
      data: {
        text: "Applico la nuova palette colori impostata",
        icon: true
      }
    });
  }

  io.emit("status", {
    type: "grabbing",
    data: {
      text: "Ottengo ultima release di Bootstrap-Italia...",
      icon: false
    }
  });

  // download - unzip - extract scss - delete rest in a TMP folder
  const tmpPath = await utils.downloadMasterZip();

  io.emit("status", {
    type: "grabbing",
    data: {
      text: "Ottengo ultima release di Bootstrap-Italia",
      icon: true
    }
  });

  io.emit("status", {
    type: "writing",
    data: {
      text: "Preparo il nuovo pacchetto Zip da scaricare...",
      icon: false
    }
  });

  // create new colors_vars.scss
  const zipFolderPath = await utils.writeNewColorsVars(tmpPath, COLOR_VARS);

  // zip folder and download
  const zipFilePath = await utils.zipCssAndSave(zipFolderPath);

  // send download response to client
  res.download(zipFilePath, zipFilePath.split("/").pop(), async err => {
    await fs.remove(tmpPath);
  });

  io.emit("status", {
    type: "writing",
    data: {
      text:
        "<strong>bootstrap-italia-custom-css.zip</strong> pronto per il download!",
      icon: true
    }
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

server.listen(port, () => console.log(`Listening on port ${port}`));

io.on("connection", socket => {
  console.log("Socket.io CONNECTED");
  socket.emit("status", {
    type: "connected",
    data: {
      text:
        'Clicca il tasto <strong>"Download"</strong> per ottenere il file CSS',
      icon: true
    }
  });
});
