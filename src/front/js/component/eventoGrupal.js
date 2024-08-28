import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/eventoGrupal.css";


export const EventoGrupal = ({ contact }) => {
    const navigate = useNavigate();



    return (
        <div>
            <div className="card">
                <div className="header1">
                    <span className="icon1">
                        <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path clipRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" fillRule="evenodd"></path>
                        </svg>
                    </span>
                    <p className="alert"></p>
                </div>

                <div className="message">
                    <p><strong>Crado por:</strong> {contact.fullname}</p>
                    <p><strong>Nombre del Grupo:</strong> {contact.username}</p>
                    <p><strong>Nombre del Evento:</strong> {contact.email}</p>
                    <p><strong>Monto $:</strong> {contact.address}</p>
                    <p><strong>Descripcion:</strong> {contact.email}</p>
                </div>

                <div className="actions1">
                    <button className="card-button secondary" onClick={handleClose}>Cancelar</button>
                    <button className="card-button primary" onClick={() => handleAddContact(contact.id)}>
                        Agregar Contacto
                    </button>
                </div>
            </div>
        </div>
    );
};
export default EventoGrupal; 