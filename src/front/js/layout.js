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
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/homeUser" element={<HomeUser />} />
                <Route path="/evento" element={<Evento />} />
            </Routes>
            {!shouldHideNavbarAndFooter && <Footer />}
        </>
    );
};

<<<<<<< HEAD
export default injectContext(Layout);
=======
export default injectContext(Layout);
>>>>>>> 3cc82db3c433dbeeb3e40d5d0adda3d79e1d5b60
