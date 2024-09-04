import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";
import createGroup from "./createGroup.js";
import "../../styles/groups.css";

const Groups = () => {

    const { store, actions } = useContext(Context);
    const navigate = useNavigate("");

    const [name, setName] = useState("");
    const [members_id, setMembers_id] = useState([]);


    const handleButton = () => {
        navigate("/createGroup")
    };

    const handleDelete = (groupId) => {
        actions.deletegroup(groupId)
    }


    return (
        <div className="groupsGeneral">

            <div className="alert alert-dark" id="tittleGroupsAlert" role="alert">
                Here you can create groups to make payments in sets.
                Now paying for vacations among all your friends will be easy and safe.
                Now everyone pays for vacations, meals and meetings!
            </div>
            <div className="conteinerButton">
                <button onClick={handleButton} className="btn btn-success" id="createNewGroupBtn">+ Create new group</button>
            </div>
            <h1 className="tittleGroups">Tus Grupos</h1>
            <table className="tableGroupsCreated rounded-3">
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
                                <td className="tdGroups">{group.members_id.length}</td>
                                <td className="tdGroups">..........</td>
                                <td className="tdGroups"><button onClick={() => handleDelete(group.id)} className="btn btn-outline-danger" type="buttom"> - Delete group </button></td>
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