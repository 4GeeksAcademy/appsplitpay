import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/contacts.css";

export const Contacts = () => {
    const { store, actions } = useContext(Context);

    const [username, setUsername] = useState("");

    const handleSearchSubmit = async (e) => {
        e.preventDefault();

        const contact = await actions.getSingleUser(username);

        if (!contact) {
            alert("Contacto no encontrado.");
        }
    };

    const handleAddContact = async (username, fullname, paypal_username, email) => {
        console.log(username, fullname, paypal_username, email);
        await actions.addContact(username, fullname, paypal_username, email);
    }

    useEffect(() => {
        actions.getContacts()
    }, [])

    return (
        <div className="table-responsive">
            <h1>Estas en el componente Contacts</h1>
            <form className="d-flex" role="search" onSubmit={handleSearchSubmit}>
                <input
                    className="form-control me-2"
                    type="search"
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    aria-label="Username"
                />
                <button className="btn btn-outline-success" type="submit">Search</button>
            </form>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Username</th>
                        <th scope="col">Paypal User</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {store.userContact != null ? (
                        <tr>
                            <td>{store.userContact.username}</td>
                            <td>{store.userContact.paypal_username}</td>
                            <td>{store.userContact.first_name + " " + store.userContact.last_name}</td>
                            <td>{store.userContact.email}</td>
                            <button onClick={() => handleAddContact(
                                store.userContact.username,
                                store.userContact.first_name + " " + store.userContact.last_name,
                                store.userContact.paypal_username,
                                store.userContact.email
                            )} className="btn btn-outline-success" type="buttom"> + add this contact </button>
                        </tr>
                    ) : (
                        <tr>
                            <td>.............</td>
                            <td>.............</td>
                            <td>.............</td>
                            <td>.............</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <h1>Tus contactos</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Username</th>
                        <th scope="col">Paypal User</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                    </tr>
                </thead>
                <tbody>
                    {store.contacts.length > 0 ? (
                        store.contacts.map((contact, index) => (
                            <tr key={index}>
                                <td>{contact.username}</td>
                                <td>{contact.paypal_user}</td>
                                <td>{contact.first_name}</td>
                                <td>{contact.email}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td>.............</td>
                            <td>.............</td>
                            <td>.............</td>
                            <td>.............</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Contacts;
