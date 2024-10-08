import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/eventoGrupal.css";
import { Context } from "../store/appContext";

export const EventoGrupal = () => {
    const { actions, store } = useContext(Context);
    const navigate = useNavigate();

    const [eventName, setEventName] = useState("");
    const [eventAmount, setEventAmount] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [selectedGroupId, setSelectedGroupId] = useState(""); // Para seleccionar el grupo al que se asocia el evento

    const handleCreateEvent = async () => {
        if (selectedGroupId && eventName && eventAmount && eventDescription) {
            const eventData = {
                name: eventName,
                amount: eventAmount,
                description: eventDescription,
                user_id: store.userInfo?.id, // Agregar user_id desde el store
                group_id: selectedGroupId // Agregar group_id seleccionado
            };

            const createdEvent = await actions.createEvent(selectedGroupId, eventData);

            if (createdEvent) {
                alert("Evento creado exitosamente");
                navigate('/grupos'); // O cualquier otra página que desees redirigir
            } else {
                alert("Error al crear el evento.");
            }
        } else {
            alert("Por favor completa todos los campos.");
        }
    };

    return (
        <div className="card">
            <div className="header1">
                <span className="icon1">
                    <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path clipRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" fillRule="evenodd"></path>
                    </svg>
                </span>
                <p className="alert">Crear nuevo evento</p>
            </div>

            <div className="message">
                <div>
                    <label>Nombre del Grupo</label>
                    <select value={selectedGroupId} onChange={(e) => setSelectedGroupId(e.target.value)}>
                        <option value="" disabled>Seleccione un grupo</option>
                        {store.groups.map((group) => (
                            <option key={group.id} value={group.id}>
                                {group.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Nombre del Evento</label>
                    <input
                        type="text"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        placeholder="Nombre del Evento"
                    />
                </div>
                <div>
                    <label>Monto $</label>
                    <input
                        type="number"
                        value={eventAmount}
                        onChange={(e) => setEventAmount(e.target.value)}
                        placeholder="Monto"
                    />
                </div>
                <div>
                    <label>Descripción</label>
                    <input
                        type="text"
                        value={eventDescription}
                        onChange={(e) => setEventDescription(e.target.value)}
                        placeholder="Descripción del evento"
                    />
                </div>
            </div>

            <div className="actions1">
                <button className="card-button secondary" onClick={() => navigate('/grupos')}>
                    Cancelar
                </button>
                <button className="card-button primary" onClick={handleCreateEvent}>
                    Crear Evento
                </button>
            </div>
        </div>
    );
};

export default EventoGrupal;
