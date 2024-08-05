import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/home";
import Login from "./component/login"; // Verifica esta ruta
import SignUp from "./component/signup"; // Verifica esta ruta
import BackendURL from "./component/backendURL"; // Verifica esta ruta
import Navbar from "./component/navbar"; // Verifica esta ruta
import Footer from "../js/component/footer";

const Layout = () => {
    // Condición para mostrar BackendURL si la variable de entorno BACKEND_URL no está configurada
    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") {
        return <BackendURL />;
    }

    const basename = process.env.BASENAME || ""; // Configuración de basename para rutas base

    return (
        <BrowserRouter basename={basename}>
            <Content />
        </BrowserRouter>
    );
};

// Componente para manejar la visualización condicional de Navbar y Footer
const Content = () => {
    const location = useLocation();

    // Rutas donde no se debe mostrar el Navbar y el Footer
    const hideNavbarAndFooter = ["/signup"];

    // Verificar si la ruta actual está en la lista de rutas para ocultar Navbar y Footer
    const shouldHideNavbarAndFooter = hideNavbarAndFooter.includes(location.pathname);

    return (
        <>
            {!shouldHideNavbarAndFooter && <Navbar />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                {/* Aquí puedes añadir más rutas según sea necesario */}
            </Routes>
            {!shouldHideNavbarAndFooter && <Footer />}
        </>
    );
};

export default Layout;
