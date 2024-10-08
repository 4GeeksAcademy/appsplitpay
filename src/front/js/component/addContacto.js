import React, { useContext, useState } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";
import "../../styles/addContacto.css";

export const AddContacto = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    // Estados para manejar los campos del formulario
    const [username, setUsername] = useState("");
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // Nuevo: Estado para manejar mensajes de error

    const handleNavigateTocontacto = () => {
        navigate('/contactos');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Modificación: Pasar un objeto con los datos de contacto en lugar de parámetros individuales
        const contactData = {
            username,
            fullname,
            email,
            address
        };

        // Llamada a la acción de addContact
        const success = await actions.addContact(contactData);

        if (success) {
            navigate("/contactos"); // Redirige a la página de contactos si se añade el contacto con éxito
        } else {
            setErrorMessage(store.errorMessage || "An error occurred during addContact.");
        }
    };

    return (
        <div className="cardContacto"> {/* Modificación: Usar className en lugar de class */}
            <span className="card__title">+ Contacto</span> {/* Modificación: Usar className en lugar de class */}
            <p className="card__content">Agrega tus contactos fácil y rápido.</p> {/* Modificación: Corregir el texto */}
            <div className="card__form"> {/* Modificación: Usar className en lugar de class */}
                <input
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    placeholder="Your username"
                    type="text"
                    required
                />
                <input
                    onChange={(e) => setFullname(e.target.value)}
                    value={fullname}
                    placeholder="Your fullname"
                    type="text"
                    required
                />
                <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    placeholder="Your Email"
                    type="email"
                    required
                />
                <input
                    onChange={(e) => setAddress(e.target.value)}
                    value={address}
                    placeholder="Your address"
                    type="text"
                    required
                />
                <button
                    className="sign-up"
                    onClick={handleSubmit}
                >
                    + Agregar Contacto
                </button>

                <button className="buttonCancel1" onClick={handleNavigateTocontacto}>
                    <span className="span-mother">
                        <span>C</span>
                        <span>a</span>
                        <span>n</span>
                        <span>c</span>
                        <span>e</span>
                        <span>l</span>
                    </span>
                    <span className="span-mother2">
                        <span>C</span>
                        <span>a</span>
                        <span>n</span>
                        <span>c</span>
                        <span>e</span>
                        <span>l</span>
                    </span>
                </button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
        </div>
    );
};

export default AddContacto;
