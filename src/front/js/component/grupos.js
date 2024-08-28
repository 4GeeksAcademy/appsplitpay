import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/grupos.css";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteModal from "../component/confirmDeleteModal.js";

export const Grupos = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const [name, setName] = useState(""); // Nombre del grupo
    const [memberIds, setMemberIds] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        actions.getContacts();
        actions.getUserGroups();
    }, []);

    const handleMemberSelect = (e) => {
        const selectedId = parseInt(e.target.value, 10);
        if (!memberIds.includes(selectedId)) {
            setMemberIds([...memberIds, selectedId]);
        }
    };

    const handleSubmit = async () => {
        if (name.trim() === "" || memberIds.length === 0) {
            alert("El nombre del grupo y al menos un miembro son obligatorios.");
            return;
        }

        const groupData = {
            name: name,
            member_ids: memberIds,
            creator_id: store.userInfo?.id || null,
        };

        const createdGroup = await actions.createGroup(groupData);
        if (createdGroup) {
            alert("Grupo creado exitosamente");
            actions.getUserGroups();
        } else {
            alert("Error al crear el grupo.");
        }
    };

    const handleNavigateToAddhomeuser = () => {
        navigate('/homeUser');
    };
    const handleNavigateToEventoGrupal = () => {
        navigate('/eventoGrupal');
    };


    const handleDeleteClick = (groupId) => {
        setGroupToDelete(groupId);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (groupToDelete) {
            const success = await actions.deleteGroup(groupToDelete);
            if (success) {
                actions.getUserGroups();
                alert("Grupo eliminado exitosamente.");
            } else {
                alert("Error al eliminar el grupo.");
            }
        }
        setShowDeleteModal(false);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setGroupToDelete(null);
    };

    const handleNavigateToEditarGrupo = (groupId) => {
        navigate(`/editarGrupo/${groupId}`);
    };

    return (
        <div className="container">
            <div className="cardContacto">
                <span className="card__title">+ Grupos</span>
                <p className="card__content">Grupos para pagar fácil y rápido.</p>
                <div className="card__form">
                    <input
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        placeholder="Nombre del grupo"
                        type="text"
                        required
                    />
                    <select className="form-select" aria-label="Default select example" onChange={handleMemberSelect}>
                        <option value="" disabled selected>Selecciona un contacto</option>
                        {store.contacts.map((contact) => (
                            <option key={contact.id} value={contact.id}>
                                {contact.fullname || contact.username}
                            </option>
                        ))}
                    </select>
                    <div className="members-list">
                        {memberIds.map((memberId, index) => {
                            const member = store.contacts.find(contact => contact.id === memberId);
                            return (
                                <div key={index} className="member-item">
                                    {member?.fullname || "Sin nombre"}
                                </div>
                            );
                        })}
                    </div>
                    <button className="sign-up" onClick={handleSubmit}>
                        + Crear grupo
                    </button>
                </div>
            </div>

            <div className="row">
                <div className="col-md-12">
                    <div className="todos-contactos">
                        <div className="filter-buttons">
                            <button className="btn-filter active">Todos los Grupos</button>
                        </div>
                        <div className="todos-contactos-lista" onClick={handleNavigateToEventoGrupal}>
                            {store.groups && store.groups.map((group, index) => (
                                <div className="contacto-lista-item" key={index}>
                                    <img src="https://img.freepik.com/fotos-premium/boton-perfil-cuenta-azul-sobre-fondo-azul_509562-71.jpg" alt={group.name} />
                                    <div className="contacto-info">
                                        <p><strong>{group.name}</strong></p>
                                        <p>Creado por: {group.creator_id}</p>
                                    </div>
                                    <button className="edit-button" onClick={() => handleNavigateToEditarGrupo(group.id)}>
                                        <svg className="edit-svgIcon" viewBox="0 0 512 512">
                                            <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4 6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                                        </svg>
                                    </button>
                                    <button className="btn2" onClick={() => handleDeleteClick(group.id)}>
                                        <p className="paragraph">delete</p>
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
                    </div>
                </div>
            </div>

            <button className="buttonCancel" onClick={handleNavigateToAddhomeuser}>
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
    );
};

export default Grupos;
