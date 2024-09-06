import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/contacts.css";
import { Navigate, useNavigate } from "react-router-dom";

export const Contacts = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

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

    const handleButton = () => {
        navigate('/newcomponent')
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

                <label htmlFor="inputPassword5" id="form-label">Search a Friend</label>
                <input type="search" className="form-control me-2" aria-label="Username" onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username" />
                <div id="searchHelpBlock" className="form-text">
                    remember to search for your friends with their Username.
                </div>
                <button className="btn btn-success" type="submit" id="searchBtn">Search</button>
            </form>
            <table id="contactInfo" className="table rounded-3">
                <thead className="table">
                    <tr>
                        <th className="thConstacts" scope="col">Username</th>
                        <th className="thConstacts" scope="col">Paypal User</th>
                        <th className="thConstacts" scope="col">Name</th>
                        <th className="thConstacts" scope="col">Email</th>
                        <th className="thConstacts" scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody className="table-contactInfoResult rounded-3">
                    {store.userContact != null ? (
                        <tr>
                            <td className="tdContacts">{store.userContact.username}</td>
                            <td className="tdContacts" >{store.userContact.paypal_username}</td>
                            <td className="tdContacts">{store.userContact.first_name + " " + store.userContact.last_name}</td>
                            <td className="tdContacts">{store.userContact.email}</td>
                            <button id="addContactBtn" onClick={() => handleAddContact(
                                store.userContact.username,
                                store.userContact.first_name + " " + store.userContact.last_name,
                                store.userContact.paypal_username,
                                store.userContact.email
                            )} className="btn btn-outline-success" type="buttom"> + add this contact </button>
                        </tr>
                    ) : (
                        <tr>
                            <td className="tdContacts">.............</td>
                            <td className="tdContacts">.............</td>
                            <td className="tdContacts">.............</td>
                            <td className="tdContacts">.............</td>
                            <td className="tdContacts">.............</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <h1 className="contactAddTittle" >"your Contacts"</h1>
            <table className="table rounded-3" id="contactsAdditions">
                <thead>
                    <tr className="table-contactsAdditionsInfo">
                        <th className="thConstacts" scope="col">Username</th>
                        <th className="thConstacts" scope="col">Paypal User</th>
                        <th className="thConstacts" scope="col">Fullname</th>
                        <th className="thConstacts" scope="col">Email</th>
                        <th className="thConstacts" scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody className="table-singelContactsAdd" >
                    {store.contacts.length > 0 ? (
                        store.contacts.map((contact, index) => (
                            <tr key={index}>
                                <td className="tdContacts">{contact.username}</td>
                                <td className="tdContacts">{contact.paypal_username}</td>
                                <td className="tdContacts">{contact.fullname}</td>
                                <td className="tdContacts">{contact.email}</td>
                                <td className="tdContacts"><button id="delateContactBtn" onClick={() => handleDelete(contact.id)} className="btn btn-outline-danger" type="buttom"> - Delete contact </button></td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td className="tdContacts">.............</td>
                            <td className="tdContacts">.............</td>
                            <td className="tdContacts">.............</td>
                            <td className="tdContacts">.............</td>
                            <td className="tdContacts">.............</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <button onClick={handleButton}>llevar a new component</button>
        </div>
    );
};

export default Contacts;
