import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";
import createGroup from "./createGroup.js";
import "../../styles/groups.css";

const Groups = () => {

    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const handleButton = () => {
        navigate("/createGroup");
    };

    const handleDetails = (groupId) => {
        navigate(`/group/${groupId}`);
    };

    const handleDelete = (groupId) => {
        const success = actions.deleteGroup(groupId);
        if (success) {
            console.log("bien");
            window.location.reload(false);
        } else {
            console.log("mal");
        }
    };

    useEffect(() => {
        actions.getUserGroups();
        actions.getUserMyGroups();
    }, []);

    return (
        <div className="groupsGeneral">
            <div className="alert alert-dark" id="tittleGroupsAlert" role="alert">
                Here you can create groups to make payments in sets.
                Now paying for vacations among all your friends will be easy and safe.
                Now everyone pays for vacations, meals and meetings!
            </div>
            <div className="imageContainer">
                <img
                    src="https://euroamericanacademy.com/wp-content/uploads/2016/02/Grupos.png"
                    alt="Groups illustration"
                    className="centeredImage"
                />
            </div>
            <div className="conteinerButton">
                <button onClick={handleButton} className="btn btn-primary" id="createNewGroupBtn">+ Create new group</button>
            </div>
            <tr />
            <h2 className="tittleGroups">Your groups:</h2>
            <table className="table rounded-3" id="tableGroupsCreated">
                <thead>
                    <tr>
                        <th className="thGroups" scope="col">Name</th>
                        <th className="thGroups" scope="col">Nº Members</th>
                        <th className="thGroups" scope="col">Nº Eventos</th>
                        <th className="thGroups" scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {store.groups.length > 0 ? (
                        store.groups.map((group, index) => (
                            <tr key={index}>
                                <td className="tdGroups">{group.name}</td>
                                <td className="tdGroups">{group.members.length}</td>
                                <td className="tdGroups">..........</td>
                                <td className="tdGroups">
                                    <button onClick={() => handleDelete(group.id)} className="btn btn-outline-danger" type="buttom"> - Delete group </button>
                                    <button onClick={() => handleDetails(group.id)} className="btn btn-outline-success" type="buttom"> - Details group </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td className="tdGroups">.............</td>
                            <td className="tdGroups">.............</td>
                            <td className="tdGroups">.............</td>
                            <td className="tdGroups">.............</td>
                        </tr>
                    )}
                </tbody>
            </table>

        </div>
    );
};

export default Groups;