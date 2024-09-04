import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-dropdown-select";
import { Context } from "../store/appContext";


export const CreateGroup = () => {

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

    const handleCancel = () => {
        navigate("/group")
    };

    return (
        <div className="card d-flex justify-content-center my-5 p-5 mx-auto" style={{ maxWidth: '600px', fontFamily: 'Trebuchet MS', width: '100%' }}>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Name:</label>
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
                    <p>Add yours contacts:</p>
                    {/* <Select
                        name="select"
                        options={store.contacts}
                        labelField={store.contacts.fullname}
                        valueField={store.contacts.id}
                        multi
                        onChange={value => setMembers_id(value)}
                        color="blue"
                        dropdownPosition="bottom"
                        searchable="true"
                    >
                    </Select> */}

                    <select className="form-select" aria-label="Default select example" multiple onChange={value => setMembers_id(value)}>
                        <option defaultValue>Open this select menu</option>
                        {store.contacts.map((contact, index) => (
                            <option key={index} value={contact.id}>{contact.fullname}</option>
                        ))}
                    </select>

                    {members_id.length > 0 ? (
                        members_id.map(member => (
                            <p>Id: {member.id} Value: {member.value}</p>
                        ))
                    ) : (
                        <p>no miembros</p>
                    )
                    }
                </div>
                <button className="btn btn-success">create group</button>
                <button className="btn btn-danger" onClick={handleCancel}>Cancel</button>
            </form>
        </div>
    );



}

export default CreateGroup;