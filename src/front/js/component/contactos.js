import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/contactos.css";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteModal from "../component/confirmDeleteModal.js";
import ModalContactoInfo from "../component/modalContactoInfo.js";

export const Contactos = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [contactToDelete, setContactToDelete] = useState(null);
    const [selectedContact, setSelectedContact] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        actions.getContacts();
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = async () => {
        if (searchQuery.trim() !== "") {

            const contacts = await actions.getContacts(searchQuery);

            if (contacts.length === 1) {
                setSelectedContact(contacts[0]);
                setShowInfoModal(true);
            } else if (contacts.length > 1) {

                console.log("Múltiples contactos encontrados:", contacts);
            } else {
                alert("Contacto no encontrado.");
            }
        }
    };

    const handleAddContact = async (contactId) => {
        setShowInfoModal(false);
        const success = await actions.addContact({ contactId });
        if (success) {
            actions.getContacts();
            navigate('/contactos');
        } else {
            alert("Error al agregar el contacto.");
        }
    };

    const handleCancelClick = () => {
        navigate('/homeUser');
    };

    const handleNavigateToAddContacto = () => {
        navigate('/addContacto');
    };

    const handleNavigateToEditarContacto = (contactId) => {
        navigate(`/editarContacto/${contactId}`);
    };

    const handleDeleteClick = (contactId) => {
        setContactToDelete(contactId);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        setShowDeleteModal(false);
        if (contactToDelete) {
            const success = await actions.deleteContact(contactToDelete);
            if (success) {
                actions.getContacts(searchQuery);
            } else {
                alert("Error al eliminar el contacto.");
            }
        }
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setContactToDelete(null);
    };

    const handleCloseInfoModal = () => {
        setShowInfoModal(false);
        setSelectedContact(null);
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="header">
                        <h1>Destinatarios</h1>
                        <div className="search-bar">
                            <div className="search-container">
                                <input
                                    className="input"
                                    placeholder="Nombre, Username, correo electrónico"
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                                <svg
                                    viewBox="0 0 24 24"
                                    className="search__icon"
                                    onClick={handleSearchSubmit}
                                    style={{ cursor: "pointer" }}
                                >
                                    <g>
                                        <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                                    </g>
                                </svg>
                            </div>
                            <button className="buttonaddContact" onClick={handleNavigateToAddContacto}>Añadir destinatario</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <div className="recientes">
                        <h2>Recientes</h2>
                        <div className="recientes-lista">
                            {store.contacts.slice(0, 5).map((contact, index) => (
                                <div className="contacto" key={index}>
                                    <img src={contact.image || "https://img.freepik.com/fotos-premium/boton-perfil-cuenta-azul-sobre-fondo-azul_509562-71.jpg"} alt={contact.fullname || contact.username} />
                                    <p>{contact.fullname || contact.username}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <div className="todos-contactos">
                        <div className="filter-buttons">
                            <button className="btn-filter active">Todos los Contactos</button>
                        </div>
                        <div className="todos-contactos-lista">
                            {store.contacts && store.contacts.map((contact, index) => (
                                <div className="contacto-lista-item" key={index}>
                                    <img src={contact.image || "https://img.freepik.com/fotos-premium/boton-perfil-cuenta-azul-sobre-fondo-azul_509562-71.jpg"} alt={contact.fullname || contact.username} />
                                    <div className="contacto-info">
                                        <p><strong>{contact.fullname || contact.username}</strong></p>
                                        <p>Cuenta AppSplit</p>
                                    </div>
                                    <button className="edit-button" onClick={() => handleNavigateToEditarContacto(contact.id)}>
                                        <svg className="edit-svgIcon" viewBox="0 0 512 512">
                                            <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4 6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                                        </svg>
                                    </button>
                                    <button className="btn2" onClick={() => handleDeleteClick(contact.id)}>
                                        <p className="paragraph"> delete </p>
                                        <span className="icon-wrapper">
                                            <svg className="icon" width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                            </svg>
                                        </span>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <ConfirmDeleteModal
                            show={showDeleteModal}
                            handleClose={handleCloseDeleteModal}
                            handleConfirm={handleConfirmDelete}
                        />
                        <ModalContactoInfo
                            show={showInfoModal}
                            contact={selectedContact}
                            handleClose={handleCloseInfoModal}
                            handleAddContact={handleAddContact}
                        />
                    </div>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <button className="buttonCancel" onClick={handleCancelClick}>
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
                </div>
            </div>
        </div>
    );
};

export default Contactos;
