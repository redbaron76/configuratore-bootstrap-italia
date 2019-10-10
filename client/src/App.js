import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import "bootstrap-italia/dist/css/bootstrap-italia.min.css";

import { readFile } from "./utils";

import Header from "./components/Header";
import Footer from "./components/Footer";

import "./App.css";

const App = () => {
  const [colors, setColors] = useState({});

  const setHexColor = (color, value) => {
    let hex = "#" + value;
    colors[color].hex = hex;
    setColors({ ...colors });
    console.log("setHexColor", value);
  };

  useEffect(async () => {
    const response = await fetch("/api/colors");
    const colors = await response.json();
    setColors(colors);
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
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default App;
