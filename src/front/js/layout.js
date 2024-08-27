import React, { useEffect, useContext } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/home";
import Login from "./component/login";
import SignUp from "./component/signup";
import BackendURL from "./component/backendURL";
import Navbar from "./component/navbar";
import Footer from "./component/footer";
import HomeUser from "./component/homeUser";
import Evento from "./component/evento";
import PasswordRecovery from "./component/passwordRecovery";
import RequestPasswordRecovery from "./component/requestPasswordRecovery.js";
import injectContext, { Context } from "./store/appContext";

const Layout = () => {
  const { actions } = useContext(Context);

  useEffect(() => {
    actions.checkAuthentication();
  }, [actions]);

  if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") {
    return <BackendURL />;
  }

  const basename = process.env.BASENAME || "";

  return (
    <BrowserRouter basename={basename}>
      <Content />
    </BrowserRouter>
  );
};

const Content = () => {
  const location = useLocation();
  const hideNavbarAndFooter = ["/signup"];
  const shouldHideNavbarAndFooter = hideNavbarAndFooter.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbarAndFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/homeUser/callback" element={<HomeUser />} />
        <Route path="/evento" element={<Evento />} />
        <Route path="/changepassword" element={<PasswordRecovery />} />
        <Route path="/requestpasswordrecovery" element={<RequestPasswordRecovery />} />
      </Routes>
      {!shouldHideNavbarAndFooter && <Footer />}
    </>
  );
};

export default injectContext(Layout);
