import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-dropdown-select";
import { Context } from "../store/appContext";


const DetailsGroup = () => {

    const { store, actions } = useContext(Context);
    const params = useParams();
    const navigate = useNavigate();

    const handleCancel=()=>{
        navigate("/group") 
    };

    return (
        <div className="card d-flex justify-content-center my-5 p-5 mx-auto" style={{ maxWidth: '600px', fontFamily: 'Trebuchet MS', width: '100%' }}>
            <button className="btn btn-outline-secundary" onClick={handleCancel}>Cancel</button>
        </div>
    );



}

export default DetailsGroup;