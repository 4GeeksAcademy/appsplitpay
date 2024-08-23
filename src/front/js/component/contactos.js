import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/contactos.css";
import { useNavigate } from "react-router-dom";

export const Contactos = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const handleCancelClick = () => {
        navigate('/homeUser');
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-8 col-md-12">
                    <div className="header">
                        <h1>Destinatarios</h1>
                        <div className="search-bar">
                            <input type="text" placeholder="Nombre, Username, correo electrónico" />
                            <button>Añadir destinatario</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-8 col-md-6 offset-md-2 col-lg-12 offset-lg-0">
                    <div className="recientes">
                        <h2>Recientes</h2>
                        <div className="recientes-lista">
                            <div className="contacto">
                                <img src="https://via.placeholder.com/50" alt="Mery Janeth" />
                                <p>Mery Janeth</p>
                            </div>
                            <div className="contacto">
                                <img src="https://via.placeholder.com/50" alt="Eugenio Santana" />
                                <p>Eugenio Santana</p>
                            </div>
                            <div className="contacto">
                                <img src="https://via.placeholder.com/50" alt="Karen Sanchez" />
                                <p>Karen Sanchez</p>
                            </div>
                            <div className="contacto">
                                <img src="https://via.placeholder.com/50" alt="Jhony Jose" />
                                <p>Jhony Jose</p>
                            </div>
                            <div className="contacto">
                                <img src="https://via.placeholder.com/50" alt="Jhonny Timaure" />
                                <p>Jhonny Timaure</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-8 col-md-6 offset-md-2 col-lg-12 offset-lg-0">
                    <div className="todos-contactos">
                        <div className="filter-buttons">
                            <button className="btn-filter active">Todos</button>
                        </div>
                        <div className="todos-contactos-lista">
                            <div className="contacto-lista-item">
                                <img src="https://via.placeholder.com/40" alt="Alba Aguilar" />
                                <div className="contacto-info">
                                    <p><strong>Alba Aguilar</strong></p>
                                    <p>Cuenta AppSplit</p>

                                </div>
                                <button><strong> <button class="edit-button">
                                    <svg class="edit-svgIcon" viewBox="0 0 512 512">
                                        <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                                    </svg>
                                </button></strong></button>
                                <button class="btn2">
                                    <p class="paragraph"> delete </p>
                                    <span class="icon-wrapper">
                                        <svg class="icon" width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                    </span>
                                </button>
                            </div>
                            <div className="contacto-lista-item">
                                <img src="https://via.placeholder.com/40" alt="Cristian Martinez" />
                                <div className="contacto-info">
                                    <p><strong>Cristian Martinez</strong></p>
                                    <p>Cuenta AppSplit</p>
                                </div>
                                <button><strong><button class="edit-button">
                                    <svg class="edit-svgIcon" viewBox="0 0 512 512">
                                        <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                                    </svg>
                                </button></strong></button>
                                <button class="btn2">
                                    <p class="paragraph"> delete </p>
                                    <span class="icon-wrapper">
                                        <svg class="icon" width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                    </span>
                                </button>
                            </div>
                            <div className="contacto-lista-item">
                                <img src="https://via.placeholder.com/40" alt="Eugenio Santana" />
                                <div className="contacto-info">
                                    <p><strong>Eugenio Santana</strong></p>
                                    <p>Cuenta AppSplit</p>
                                </div>
                                <button><strong> <button class="edit-button">
                                    <svg class="edit-svgIcon" viewBox="0 0 512 512">
                                        <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                                    </svg>
                                </button></strong></button>
                                <button class="btn2">
                                    <p class="paragraph"> delete </p>
                                    <span class="icon-wrapper">
                                        <svg class="icon" width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                    </span>
                                </button>
                            </div>
                            <div className="contacto-lista-item">
                                <img src="https://via.placeholder.com/40" alt="fourgeeks Academy" />
                                <div className="contacto-info">
                                    <p><strong>4geeks Academy</strong></p>
                                    <p>Cuenta AppSplit</p>
                                </div>
                                <button><strong> <button class="edit-button">
                                    <svg class="edit-svgIcon" viewBox="0 0 512 512">
                                        <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                                    </svg>
                                </button></strong></button>
                                <button class="btn2">
                                    <p class="paragraph"> delete </p>
                                    <span class="icon-wrapper">
                                        <svg class="icon" width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <button className="buttonCancel" onClick={handleCancelClick}>
                        <span class="span-mother">
                            <span>C</span>
                            <span>a</span>
                            <span>n</span>
                            <span>c</span>
                            <span>e</span>
                            <span>l</span>
                        </span>
                        <span class="span-mother2">
                            <span>C</span>
                            <span>a</span>
                            <span>n</span>
                            <span>c</span>
                            <span>e</span>
                            <span>l</span>
                        </span>
                    </button>

                </div>
            </div>
        </div>
    );
};

export default Contactos;
