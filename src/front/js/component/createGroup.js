import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-dropdown-select";
import { Context } from "../store/appContext";
import "../../styles/createGroup.css";


export const CreateGroup = () => {

    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const [name, setname] = useState("");
    const [members_id, setMembers_id] = useState([]);

    useEffect(() => {
        actions.getContacts();
    }, []);

    const ids = [];
    members_id.forEach((member) => ids.push(member.id));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (name && members_id.length > 0) {
            await actions.createGroup(name, ids);
            navigate("/group");
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
                    <Select
                        name="select"
                        options={store.contacts}
                        labelField="fullname"
                        valueField="id"
                        multi
                        onChange={value => setMembers_id(value)}
                        color="blue"
                        dropdownPosition="bottom"
                        searchable="true"
                    >
                    </Select>
                </div>
                <button type="submit" className="btn btn-primary">create group</button>
                <button className="btn btn-outline-secundary" onClick={handleCancel}>Cancel</button>
            </form>
        </div>
    );



}

export default CreateGroup;