import "../../styles/grupos.css";
import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";


export const Grupos = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const handleCancelClick = () => {
        navigate('/homeUser');
    };

    return (
        <h1>holaMundo</h1>
    )
};

export default Grupos;