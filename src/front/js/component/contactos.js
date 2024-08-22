import React, { useContext, useState } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/Contactos.css";
import { useNavigate } from "react-router-dom";

export const Contactos = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

}
export default Contactos;