import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import download from "downloadjs";
import "bootstrap-italia/dist/css/bootstrap-italia.min.css";

import Header from "./components/Header";
import Footer from "./components/Footer";

import "./App.css";

const App = () => {
  const [colors, setColors] = useState({});

  const handleDownload = async e => {
    e.preventDefault();
    const response = await fetch("/api/colors", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(colors)
    });
    const zipBlob = await response.blob();
    download(zipBlob, "bootstrap-italia-custom-css.zip");
  };

  const setHexColor = (color, value) => {
    let hex = value ? "#" + value : value;
    // Set custom hex color
    colors[color].hex = hex;
    // Set specific color on type hex
    setColors({ ...colors });
  };

  useEffect(() => {
    async function fetchData() {
      // Get GitHub colors
      const response = await fetch("/api/colors");
      // Decode default colors
      const colors = await response.json();
      // Set default colors
      setColors(colors);
    }
    fetchData();
    // run onLoad
  }, []);

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Bootstrap-Italia Theme Color Configurator</title>
        <style type="text/css">
          {`
          body {
          }
        `}
        </style>
      </Helmet>
      <Header />
      <main>
        <section className="p-5">
          <div className="container">
            <form className="px-4">
              {Object.keys(colors).map((color, i) => {
                let hex = colors[color].hex.replace("#", "");
                return (
                  <div key={"color - " + i} className="form-group">
                    <h6 className="">{`$${color}`}</h6>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">#</span>
                      </div>
                      <input
                        className="form-control col-2"
                        name={color}
                        value={hex}
                        onChange={e => setHexColor(color, e.target.value)}
                      />
                      <div className="input-group-append">
                        <div
                          className="box-color-preview"
                          id={color}
                          style={{ backgroundColor: "#" + hex }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="row">
                <div className="col">
                  <button className="btn btn-primary" onClick={handleDownload}>
                    Download CSS
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default App;
