import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import download from "downloadjs";
import io from "socket.io-client";
import "bootstrap-italia/dist/css/bootstrap-italia.min.css";

import Header from "./components/Header";
import Footer from "./components/Footer";

import { getStyleColor } from "./utils";

import "./App.css";

const App = () => {
  const [colors, setColors] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({});

  const handleDownload = async e => {
    e.preventDefault();
    setLoading(true);
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
    setLoading(false);
  };

  const setHexColor = (color, value) => {
    let hex = value ? "#" + value : value;
    // Set custom hex color
    colors[color].hex = hex;
    // Set specific color on type hex
    setColors({ ...colors });
  };

  useEffect(() => {
    // Connect to socket.IO server

    const socket = io.connect("");
    // socket event receiver
    socket.on("status", ({ type, data }) => {
      status[type] = data;
      setStatus({ ...status });
    });

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
        <title>Bootstrap-Italia - Configuratore Tema / Colore</title>
        <style type="text/css">
          {`
          body {
          }
          .it-header-slim-wrapper {
            background-color: ${getStyleColor(
              colors.primary && colors.primary.hex,
              70
            )}
          }
          .it-header-center-wrapper {
            background-color: ${getStyleColor(
              colors.primary && colors.primary.hex,
              80
            )}
          }
          .it-footer-main {
            background-color: ${getStyleColor(
              colors.primary && colors.primary.hex,
              null,
              -20
            )}
          }
          .it-footer-small-prints {
            background-color: ${getStyleColor(
              colors.primary && colors.primary.hex,
              null,
              -20,
              -10
            )}
          }
          .btn-primary {
            background-color: ${getStyleColor(
              colors.primary && colors.primary.hex,
              80
            )}
          }
          .btn-primary:hover {
            background-color: ${getStyleColor(
              colors.primary && colors.primary.hex,
              80,
              -8
            )}
          }
        `}
        </style>
      </Helmet>
      <Header />
      <main>
        <section className="py-5 px-2 p-sm-5">
          <div className="container">
            <div className="row">
              <div className="col-sm-6">
                <div className="row">
                  <div className="col px-4 pb-5">
                    <h3>Crea una nuova palette colore</h3>
                  </div>
                </div>
                <form className="px-4">
                  {Object.keys(colors).map((color, i) => {
                    let hex = colors[color].hex;
                    console.log("hex?", colors[color]);
                    return (
                      <div key={"color - " + i} className="form-group">
                        <h6 className="">{`$${color}`}</h6>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">#</span>
                          </div>
                          <input
                            maxLength={6}
                            className="form-control input-control"
                            name={color}
                            value={hex.replace("#", "")}
                            onChange={e => setHexColor(color, e.target.value)}
                            onFocus={e => e.target.select()}
                          />
                          <div className="input-group-append">
                            <div
                              className="box-color-preview"
                              id={color}
                              style={{
                                backgroundColor:
                                  hex && hex.length === 7 ? hex : "transparent"
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </form>
              </div>
              <div className="col-sm-6">
                <div className="px-4">
                  {Object.keys(status).map((s, i) => {
                    let o = status[s];
                    return (
                      <div
                        key={"alert-" + i}
                        className={`alert alert-${o.icon ? "success" : "info"}`}
                        role="alert"
                        dangerouslySetInnerHTML={{ __html: o.text }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col p-4">
                <button
                  className={`btn btn-${loading ? "secondary" : "primary"}`}
                  onClick={handleDownload}
                  disabled={loading}
                >
                  {loading ? (
                    <i className="fa fa-refresh fa-spin fa-fw" />
                  ) : (
                    <i className="fa fa-cloud-download" />
                  )}
                  {loading ? (
                    <span>Elaborazione in corso...</span>
                  ) : (
                    <span>Download Custom CSS</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default App;
