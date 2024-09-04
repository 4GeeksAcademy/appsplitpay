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
        let success = await actions.addContact(username, fullname, paypal_username, email);
        if (success) { window.location.reload(false); }
    }

    const handleDelete = async (contactId) => {
        const success = await actions.deleteContact(contactId);
        if (success) { window.location.reload(false); }
    }

    useEffect(() => {
        actions.getContacts()
    }, [])

    return (
        <div className="table-responsive" id="table-general">
            <h1 className="contactTitle">"Connect with your Contacts"</h1>

            <div className="alert alert-dark" role="alert" id="text">
                In this area you can search for your best friends and add them to your contacts so that you can use their information to make fast and secure payments.
                Remember that our account is the only one that allows you to make group payments.
                Add your friends, create your groups, make group payments and let the fun continue.
            </div>
            <form className="d-flex " role="search" onSubmit={handleSearchSubmit} id="userSearch">

                <label for="inputPassword5" id="form-label">Search a Friend</label>
                <input type="search" class="form-control me-2" aria-label="Username" onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username" />
                <div id="searchHelpBlock" class="form-text">
                    remember to search for your friends with their Username.
                </div>
                <button className="btn btn-success" type="submit" id="searchBtn">Search</button>
            </form>
            <table className="table rounded-3" id="contactInfo">
                <thead className="table">
                    <tr>
                        <th scope="col">Username</th>
                        <th scope="col">Paypal User</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody className="table-contactInfoResult rounded-3">
                    {store.userContact != null ? (
                        <tr>
                            <td>{store.userContact.username}</td>
                            <td>{store.userContact.paypal_username}</td>
                            <td>{store.userContact.first_name + " " + store.userContact.last_name}</td>
                            <td>{store.userContact.email}</td>
                            <button id="addContactBtn" onClick={() => handleAddContact(
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
                            <td>.............</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <h1 className="contactAddTittle">"your Contacts"</h1>
            <table className="table rounded-3 " id="contactsAdditions"  >
                <thead>
                    <tr className="table-contactsAdditionsInfo">
                        <th scope="col">Username</th>
                        <th scope="col">Paypal User</th>
                        <th scope="col">Fullname</th>
                        <th scope="col">Email</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody className="table-singelContactsAdd" >
                    {store.contacts.length > 0 ? (
                        store.contacts.map((contact, index) => (
                            <tr key={index}>
                                <td>{contact.username}</td>
                                <td>{contact.paypal_username}</td>
                                <td>{contact.fullname}</td>
                                <td>{contact.email}</td>
                                <td><button id="delateContactBtn" onClick={() => handleDelete(contact.id)} className="btn btn-outline-danger" type="buttom"> - Delete contact </button></td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td>.............</td>
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
