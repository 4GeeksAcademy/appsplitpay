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
        actions.getAllUsers();
    }, []);

    const usernames = [];
    members_id.forEach((member) => usernames.push(member.username));

    const usernamesDB = [];
    const users = store.allUsers;
    users.forEach(user => { 
        usernamesDB.push(user.username);
    });

    const ids = [];
    for (const member of members_id) {
        for (const user of users) {
            if (member.username == user.username) {
                ids.push(user.id);
                console.log("user en el for",user.id)
            }
        }
    }

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
                    <p>select your contacts:</p>
                    <Select
                        name="select"
                        options={store.contacts}
                        labelField="fullname"
                        valueField="id"
                        multi
                        onChange={value => setMembers_id(value)}
                        color="green"
                        dropdownPosition="bottom"
                        searchable="true"
                    >
                    </Select>
                </div>
                <div className="containerBtn">
                    <button type="submit" className="btn btn-success" id="btn-successCreateGroup">Create a group</button>
                    <button className="btn btn-danger" onClick={handleCancel} id="btn-dangerCreateGroup">Cancel</button>
                </div>
            </form>
        </div>
    );



}

export default CreateGroup;