import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/editarContacto.css";

export const EditarContacto = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const { contactId } = useParams();

    const [username, setUsername] = useState("");
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");

    useEffect(() => {
        const contact = store.contacts.find(contact => contact.id === parseInt(contactId));
        if (contact) {
            setUsername(contact.username);
            setFullname(contact.fullname);
            setEmail(contact.email);
            setAddress(contact.address);
        }
    }, [contactId, store.contacts]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedContactData = {
            username,
            fullname,
            email,
            address
        };
        const success = await actions.editContact(contactId, updatedContactData);
        if (success) {
            navigate("/contactos");
        }
    };

    return (
        <form className="formEditContact" onSubmit={handleSubmit}>
            <p className="title1">Edita tus contactos </p>
            <p className="message">Modifica los datos de tus contactos rápidamente. </p>
            <label>
                <input className="input" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <span>Edita el Username</span>
            </label>
            <label>
                <input className="input" type="text" placeholder="Fullname" value={fullname} onChange={(e) => setFullname(e.target.value)} required />
                <span>Edita el Fullname</span>
            </label>
            <label>
                <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <span>Edita el Email</span>
            </label>
            <label>
                <input className="input" type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                <span>Edita la Address</span>
            </label>
            <button className="submit">Confirmar</button>
            <button type="button" className="buttoncanceleditcontact" onClick={() => navigate('/contactos')}>
                Cancelar
            </button>
        </form>
    );
};

export default EditarContacto;
