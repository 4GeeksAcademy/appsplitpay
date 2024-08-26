import React from "react";
import "../../styles/modalContactoInfo.css";
import { useNavigate } from "react-router-dom";

const ModalContactoInfo = ({ show, contact, handleClose, handleAddContact }) => {
    const navigate = useNavigate();

    if (!show) {
        return null;
    }

    return (
        <div className="card">
            <div className="header1">
                <span className="icon1">
                    <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path clipRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" fillRule="evenodd"></path>
                    </svg>
                </span>
                <p className="alert">Contacto Encontrado</p>
            </div>

            <div className="message">
                <p><strong>Nombre Completo:</strong> {contact.fullname}</p>
                <p><strong>Username:</strong> {contact.username}</p>
                <p><strong>Email:</strong> {contact.email}</p>
                <p><strong>Dirección:</strong> {contact.address}</p>
            </div>

            <div className="actions1">
                <button className="card-button secondary" onClick={handleClose}>Cancelar</button>
                <button className="card-button primary" onClick={() => handleAddContact(contact.id)}>
                    Agregar Contacto
                </button>
            </div>
        </div>
    );
};

export default ModalContactoInfo;