import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/navbar.css";
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
      navigate("/homeUser");  // Redirige a HomeUser si está autenticado
    } else {
      navigate("/");  // Redirige a la página de login si no está autenticado
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark ">
      <div className="container-fluid bg-dark">
        {/* Logo */}
        <div onClick={handleLogoClick} className="navbar-brand d-flex align-items-center me-auto" style={{ cursor: "pointer", width: "300px" }}>
          <h1 style={{ color: "white" }}>AppSplitPay</h1>
        </div>
        {/* Toggle Buttom */}
        <button className="navbar-toggler shadow-none border-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        {/* SideBar */}
        <div className="offcanvas offcanvas-start bg-dark" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
          <div className="offcanvas-header text-white border-bottom">
            <h5 className="offcanvas-title text-white" id="offcanvasNavbarLabel">SplitPay Navbar</h5>
            <button type="button" className="btn-close btn-close-white shadow-none" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          {store.isAuthenticated ? (
            <div className="offcanvas-body d-flex flex-column flex-lg-row p-4 p-lg-0">
              <ul className="navbar-nav justify-content-center align-items-center fs-5 flex-grow-1 pe-3" id="navButtons">
                <li className="nav-item mx-2">
                  <Link to="/homeUser" className="nav-link" aria-current="page">Home</Link>
                </li>
                <li className="nav-item mx-2">
                  <Link to="/contacts" className="nav-link">Contacts</Link>
                </li>
                <li className="nav-item mx-2">
                  <Link to="/group" className="nav-link">Groups</Link>
                </li>
                <li className="nav-item mx-2">
                  <Link to="/records" className="nav-link">Records</Link>
                </li>
                <li className="nav-item mx-2">
                  <Link to="/profile" className="nav-link">Profile</Link>
                </li>
              </ul>
              <div className="d-flex flex-column flex-lg-row justify-content-center align-items-center gap-3" id="UserLogout">
                <button className="text-white text-decoration-none px-3 py-1 bg-primary rounded-4" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="offcanvas-body d-flex flex-column flex-lg-row p-4 p-lg-0">
              <ul className="navbar-nav justify-content-center align-items-center fs-5 flex-grow-1 pe-3"></ul>
              <div className="d-flex flex-column flex-lg-row justify-content-center align-items-center gap-3">
                <Link to="/login" className="text-white">Login</Link>
                <Link to="/signup" className="text-white text-decoration-none px-3 py-1 bg-primary rounded-4">Sign Up</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
