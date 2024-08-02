import React from "react";
import { Link } from "react-router-dom";
import "../../styles/index.css";

export const Navbar = () => {
  return (
    //// <nav className="navbar navbar-light bg-light">
    //  <div className="container">
    //    <Link to="/">
    //      <span className="navbar-brand mb-0 h1">React Boilerplate</span>
    //    </Link>
    //    <div className="ml-auto">
    //      <Link to="/demo">
    //        <button className="btn btn-primary">
    //          Check the Context in action
    //        </button>
    //      </Link>
    //    </div>
    //  </div>
    //</nav>

    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          SPLITAPP (LOGO)
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span classname="navbar-toggler-icon"></span>
        </button>
        <div classname="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">
                <i className="fa-regular fa-bell"></i>
              </a>
            </li>
            <img src="" className="imagen" alt=""></img>
            <li className="nav-item">
              <a className="nav-link" href="#">
                NOMBRE DE USUARIO
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
