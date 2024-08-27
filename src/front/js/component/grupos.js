import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/grupos.css";
import { useNavigate } from "react-router-dom";

export const Grupos = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const [name, setName] = useState(""); // Nombre del grupo
    const [memberIds, setMemberIds] = useState([]);
    useEffect(() => {
        actions.getContacts(); // Asegurarse de que los contactos estén cargados
    }, []);

    const handleNavigateToAddhomeuser = () => {
        navigate('/homeUser');
    };

    const handleMemberSelect = (e) => {
        const selectedId = parseInt(e.target.value, 10); // Convertir el valor a número entero
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
            navigate('/homeUser');
        } else {
            alert("Error al crear el grupo.");
        }
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
                        <option value="" selected disabled>Selecciona un contacto</option>
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
