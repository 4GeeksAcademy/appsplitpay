import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/home.css";
import { Context } from '../store/appContext.js';

const Navbar = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  // Verifica la autenticación cuando se monta el componente
  useEffect(() => {
    actions.checkAuthentication();
  }, [store.token]);

  const handleLogout = async () => {
    const success = await actions.logout();
    if (success) {
      navigate("/");
    }
  };

  const handleLogoClick = () => {
    if (store.isAuthenticated) {
      navigate("/");  // Redirige a HomeUser si está autenticado
    } else {
      navigate("/login");  // Redirige a la página de login si no está autenticado
    }
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar" style={{ backgroundColor: "#274d95", fontFamily: "Trebuchet MS" }}>
      <div className="container-fluid d-flex align-items-center">
        <div onClick={handleLogoClick} className="navbar-brand d-flex align-items-center me-auto" style={{ cursor: "pointer" }}>
          <h1 style={{ color: "white" }}>AppSplitPay</h1>
        </div>

        <button className="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
          <div className="navbar-nav ms-auto">
            {store.isAuthenticated ? (
              <button className="btn btn-light" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <>
                <Link className="btn me-2 text-white" to="/login">
                  Iniciar sesión
                </Link>
                <Link className="btn btn-light" to="/signup">
                  Crea una cuenta
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

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
