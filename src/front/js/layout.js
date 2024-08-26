import React, { useEffect, useContext } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/home";
import Login from "./component/login";
import SignUp from "./component/signup";
import BackendURL from "./component/backendURL";
import Navbar from "./component/navbar";
import Footer from "../js/component/footer";
import HomeUser from "../js/component/homeUser";
import Evento from "../js/component/evento";
import injectContext, { Context } from "./store/appContext";
import Contactos from "./component/contactos";
import ScrollToTop from "../js/component/scrollToTop";
import AddContacto from "./component/addContacto";
import EditarContacto from "../js/component/editarContacto";
import ConfirmDeleteModal from "../js/component/confirmDeleteModal";
import ModalContactoInfo from "./component/modalContactoInfo";
import Grupos from "./component/grupos";

const Layout = () => {
    const { actions } = useContext(Context);

    useEffect(() => {
        actions.checkAuthentication();
    }, []);

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
                    <Route path="/modalContactoInfo" element={<ModalContactoInfo />} />
                    <Route path="/grupos" element={<Grupos />} />
                </Routes>
            </ScrollToTop>
            {!shouldHideNavbarAndFooter && <Footer />}
        </>
    );
};

export default injectContext(Layout);
