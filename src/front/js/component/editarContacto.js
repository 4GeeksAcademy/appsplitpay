import React, { useContext, useState } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";
import "../../styles/editarContacto.css";

export const EditarContacto = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();



    return (
        <form className="formEditContact">
            <p className="title1">Edita tus contactos </p>
            <p className="message">Modifica los datos de tus contactos rapidamente. </p>
            <label>
                <input className="input" type="email" placeholder="" required="" />
                <span>Email</span>
            </label>
            <label>
                <input className="input" type="email" placeholder="" required="" />
                <span>Email</span>
            </label>

            <label>
                <input className="input" type="email" placeholder="" required="" />
                <span>Email</span>
            </label>

            <label>
                <input className="input" type="password" placeholder="" required="" />
                <span>Password</span>
            </label>
            <label>
                <input className="input" type="password" placeholder="" required="" />
                <span>Confirm password</span>
            </label>
            <button className="submit">Submit</button>
            <p className="signin">Already have an acount ?  </p>
        </form>
    );
};


export default EditarContacto;