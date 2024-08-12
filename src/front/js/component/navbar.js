import React, { useContext } from "react";
import { Link } from "react-router-dom";
import splitpay from "../../img/splitpay.jpeg"; // Ajusta la ruta a tu logo
import "../../styles/home.css"; // Asegúrate de importar el archivo CSS
import { Context } from '../store/appContext'


const Navbar = () => {
  const { store } = useContext(Context);
  return (
    <nav
      className="navbar navbar-expand-lg custom-navbar"
      style={{ backgroundColor: "#274d95", fontFamily: "Trebuchet MS" }}
    >
      <div className="container-fluid d-flex align-items-center">
        {/* Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center me-auto">
          <h1 style={{ color: "white" }}>AppSplitPay</h1>
        </Link>

        {/* Toggler button */}
        <button
          className="navbar-toggler ms-auto"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo01"
          aria-controls="navbarTogglerDemo01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible items */}
        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
          <div className="navbar-nav ms-auto">
            {store.token ? (
              <>
                <Link className="btn me-2 text-white" to="/login">
                  Iniciar sesión
                </Link>
                <Link className="btn btn-light" to="/signup">
                  Crea una cuenta
                </Link>
              </>
            ) : (
              <>
                <Link className="btn btn-light" to="/logout">
                  Logout
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Custom styles */}
      <style>
        {`
          .custom-navbar {
              background-color: #003459;
              padding: 0 2rem;
          }

          .navbar-toggler-icon {
              background-image: url("data:image/svg+xml;charset=UTF8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba%28255, 255, 255, 1%29' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3Csvg%3E");
          }

          .navbar-brand img {
              height: 40px;
          }
        `}
      </style>
    </nav>
  );
};

export default Navbar;
