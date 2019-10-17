import React from "react";
import sprite from "bootstrap-italia/dist/svg/sprite.svg";

const Header = () => (
  <header className="it-header-wrapper it-header-sticky">
    <div className="it-header-slim-wrapper">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="it-header-slim-wrapper-content font-weight-bold">
              <a
                className="d-lg-block navbar-brand"
                href="https://italia.github.io/bootstrap-italia/"
              >
                Bootstrap-Italia - Configuratore Tema / Colore
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="it-nav-wrapper">
      <div className="it-header-center-wrapper">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="it-header-center-content-wrapper">
                <div className="it-brand-wrapper">
                  <a href="https://italia.github.io/bootstrap-italia/">
                    <svg className="icon">
                      <use xlinkHref={`${sprite}#it-pa`}></use>
                    </svg>
                    <div className="it-brand-text">
                      <h2 className="no_toc">Nome del Comune</h2>
                      <h3 className="no_toc d-none d-md-block">
                        Uno dei tanti Comuni d'Italia
                      </h3>
                    </div>
                  </a>
                </div>
                <div className="it-right-zone">
                  <div className="it-socials d-none d-md-flex">
                    <span>Seguici su</span>
                    <ul>
                      <li>
                        <a
                          aria-label="Facebook"
                          href="https://italia.github.io/bootstrap-italia/"
                          target="_blank"
                        >
                          <svg className="icon">
                            <use xlinkHref={`${sprite}#it-facebook`}></use>
                          </svg>
                        </a>
                      </li>
                      <li>
                        <a
                          aria-label="Github"
                          href="https://italia.github.io/bootstrap-italia/"
                          target="_blank"
                        >
                          <svg className="icon">
                            <use xlinkHref={`${sprite}#it-github`}></use>
                          </svg>
                        </a>
                      </li>
                      <li>
                        <a
                          aria-label="Twitter"
                          href="https://italia.github.io/bootstrap-italia/"
                          target="_blank"
                        >
                          <svg className="icon">
                            <use xlinkHref={`${sprite}#it-twitter`}></use>
                          </svg>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="it-search-wrapper">
                    <span className="d-none d-md-block">Cerca</span>
                    <a
                      aria-label="Cerca"
                      className="search-link rounded-icon"
                      href="https://italia.github.io/bootstrap-italia/"
                    >
                      <svg className="icon">
                        <use xlinkHref={`${sprite}#it-search`}></use>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
