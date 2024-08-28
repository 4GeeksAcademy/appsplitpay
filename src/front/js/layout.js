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
import Contactos from "./component/contactos";
import ScrollToTop from "../js/component/scrollToTop";
import AddContacto from "./component/addContacto";
import EditarContacto from "../js/component/editarContacto";
import ConfirmDeleteModal from "../js/component/confirmDeleteModal";
import ModalContactoInfo from "./component/modalContactoInfo";
import Grupos from "./component/grupos";
import ConfirmDeleteGroup from "../js/component/confirmDeleteGroup.js";
import EventoGrupal from "./component/eventoGrupal.js";

const Layout = () => {
  const { actions } = useContext(Context);

  useEffect(() => {
    actions.checkAuthentication();
  }, []);

  if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") {
    return <BackendURL />;
  }

  return (
    <BrowserRouter>
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
      <ScrollToTop>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/homeUser" element={<HomeUser />} />
          <Route path="/evento" element={<Evento />} />
          <Route path="/contactos" element={<Contactos />} />
          <Route path="/addContacto" element={<AddContacto />} />
          <Route path="/editarContacto/:contactId" element={<EditarContacto />} />
          <Route path="/confirmDeleteModal" element={<ConfirmDeleteModal />} />
          <Route path="/confirmDeleteGroup" element={<ConfirmDeleteGroup />} />
          <Route path="/modalContactoInfo" element={<ModalContactoInfo />} />
          <Route path="/grupos" element={<Grupos />} />
          <Route path="/eventoGrupal" element={<EventoGrupal />} />
          <Route path="/changepassword" element={<PasswordRecovery />} />
          <Route path="/requestpasswordrecovery" element={<RequestPasswordRecovery />} />
        </Routes>
      </ScrollToTop>
      {!shouldHideNavbarAndFooter && <Footer />}
    </>
  );

};

export default injectContext(Layout);
