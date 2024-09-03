import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";
import createGroup from "./createGroup.js";
import "../../styles/groups.css";

const Groups = () => {
const {store, actions}= useContext(Context);
const [name, setName]=useState("")
const [members_id, setMembers_id]=useState([])
const navigate = useNavigate("")


const handleButton=()=>{
    navigate("/createGroup") 
}


  return (
    <>
            {store.groups.length > 0 ? (
                <div className="card text-center">
                    <div className="card-header">{store.groups.name}</div>
                    <div className="card-body">
                        <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                        <a href="#" className="btn btn-primary" data-mdb-ripple-init>Button</a>
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <p>There's no availables groups .</p>
                    <button 
                        onClick={handleButton} 
                        className="btn btn-primary">
                        Crear Grupo
                    </button>
                </div>
            )}
        </>
  );
};

export default Groups;