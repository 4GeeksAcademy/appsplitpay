import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";

const CreateGroup = () => {
    const { store, actions } = useContext(Context)
    const navigate = useNavigate("")
    const [name, setname] = useState("");
    const [members_id, setMembers_id] = useState([]);

    useEffect(() => {
        actions.getContacts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Group Name:", name); // Verifica el valor de `name`
        console.log("Selected Members:", members_id); // Verifica el valor de `members_id`
        console.log("Members ID Length:", members_id.length); // Verifica la longitud de `members_id`
        if (name && members_id.length > 0) {
            await actions.createGroup(name, members_id);
            navigate("/group"); // Redirige a la vista de grupos
        } else {
            alert("Please provide a group name and select at least one member.");
        }
    };

    const handleSelectChange = (contact) => {
        setMembers_id([...members_id, contact]);

    };

    return (
        <div className="card d-flex justify-content-center my-5 p-5 mx-auto" style={{ maxWidth: '600px', fontFamily: 'Trebuchet MS', width: '100%' }}>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label" />
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Add a cool name to your group"
                        value={name}
                        onChange={(e) => setname(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Username</th>
                                <th scope="col">Paypal User</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {store.contacts.length > 0 ? (
                                store.contacts.map((contact, index) => (
                                    <tr key={index}>
                                        <td>{contact.username}</td>
                                        <td>{contact.fullname}</td>
                                        <td><button onClick={()=>handleSelectChange(contact.id)}>Add</button></td>
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
                <button type="submit" className="btn btn-primary">create group</button>
            </form>
        </div>
    );



}

export default CreateGroup;