import React, { useContext, useState } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/homeUser.css";
import { useNavigate } from "react-router-dom";
import Evento from "../component/evento.js";

export const HomeUser = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleNavigateToContactos = () => {
    navigate('/contactos');
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-3 .col-sm-4">
          <div className="sidebar">
            <ul>
              <li className="active">
                {" "}
                <i className="fa-solid fa-house"></i> Inicio
              </li>
              <li>
                <i className="fa-regular fa-credit-card"></i> Tarjeta
              </li>
              <li onClick={handleNavigateToContactos}>
                <i className="fa-solid fa-people-arrows"></i> Destinatarios
              </li>
              <li onClick={openModal}>
                <i className="fa-solid fa-file-invoice-dollar"></i> Pagos
              </li>
            </ul>
          </div>
          <Evento isOpen={isModalOpen} onClose={closeModal} />
        </div>
        <div className="col-8 .col-sm-4">
          <div className="main-content">
            <div className="balance">
              <h2>Saldo total: 2,07 EUR</h2>
              <div className="actions">
                <button className="send">
                  <i className="fa-solid fa-arrow-up"></i> Enviar
                </button>
                <button className="add">
                  <i className="fa-solid fa-plus"></i>Añadir dinero
                </button>
                <button className="request">
                  <i className="fa-solid fa-arrow-down"></i>Solicitar
                </button>
              </div>
            </div>

            <div className="currency-cards">
              <div class="card">
                <div class="title">
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1792 1792" height="20" fill="currentColor" width="20">
                      <path d="M1362 1185q0 153-99.5 263.5t-258.5 136.5v175q0 14-9 23t-23 9h-135q-13 0-22.5-9.5t-9.5-22.5v-175q-66-9-127.5-31t-101.5-44.5-74-48-46.5-37.5-17.5-18q-17-21-2-41l103-135q7-10 23-12 15-2 24 9l2 2q113 99 243 125 37 8 74 8 81 0 142.5-43t61.5-122q0-28-15-53t-33.5-42-58.5-37.5-66-32-80-32.5q-39-16-61.5-25t-61.5-26.5-62.5-31-56.5-35.5-53.5-42.5-43.5-49-35.5-58-21-66.5-8.5-78q0-138 98-242t255-134v-180q0-13 9.5-22.5t22.5-9.5h135q14 0 23 9t9 23v176q57 6 110.5 23t87 33.5 63.5 37.5 39 29 15 14q17 18 5 38l-81 146q-8 15-23 16-14 3-27-7-3-3-14.5-12t-39-26.5-58.5-32-74.5-26-85.5-11.5q-95 0-155 43t-60 111q0 26 8.5 48t29.5 41.5 39.5 33 56 31 60.5 27 70 27.5q53 20 81 31.5t76 35 75.5 42.5 62 50 53 63.5 31.5 76.5 13 94z">
                      </path>
                    </svg>
                  </span>
                  <p class="title-text">
                    Sales
                  </p>
                  <p class="percent">
                    <svg width="20" height="20" fill="#B9101E" viewBox="0 0 1792 1792" xmlns="[http://www.w3.org/2000/svg ↗](http://www.w3.org/2000/svg)"> <path d="M384 576q0-26 19-45t45-19h896q26 0 45 19t19 45-19 45l-448 448q-19 19-45 19t-45-19l-448-448q-19-19-19-45z"></path> </svg> 20%
                  </p>
                </div>
                <div class="data">
                  <p>
                    1,500 €
                  </p>

                  <div class="range">
                    <div class="fill">
                    </div>
                  </div>
                </div>
              </div>
              <div class="card2">
                <div class="title2">
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1792 1792" height="20" fill="currentColor" width="20">
                      <path d="M1362 1185q0 153-99.5 263.5t-258.5 136.5v175q0 14-9 23t-23 9h-135q-13 0-22.5-9.5t-9.5-22.5v-175q-66-9-127.5-31t-101.5-44.5-74-48-46.5-37.5-17.5-18q-17-21-2-41l103-135q7-10 23-12 15-2 24 9l2 2q113 99 243 125 37 8 74 8 81 0 142.5-43t61.5-122q0-28-15-53t-33.5-42-58.5-37.5-66-32-80-32.5q-39-16-61.5-25t-61.5-26.5-62.5-31-56.5-35.5-53.5-42.5-43.5-49-35.5-58-21-66.5-8.5-78q0-138 98-242t255-134v-180q0-13 9.5-22.5t22.5-9.5h135q14 0 23 9t9 23v176q57 6 110.5 23t87 33.5 63.5 37.5 39 29 15 14q17 18 5 38l-81 146q-8 15-23 16-14 3-27-7-3-3-14.5-12t-39-26.5-58.5-32-74.5-26-85.5-11.5q-95 0-155 43t-60 111q0 26 8.5 48t29.5 41.5 39.5 33 56 31 60.5 27 70 27.5q53 20 81 31.5t76 35 75.5 42.5 62 50 53 63.5 31.5 76.5 13 94z">
                      </path>
                    </svg>
                  </span>
                  <p class="title-text">
                    Sales
                  </p>
                  <p class="percent">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1408 1216q0 26-19 45t-45 19h-896q-26 0-45-19t-19-45 19-45l448-448q19-19 45-19t45 19l448 448q19 19 19 45z">
                      </path>
                    </svg> 20%
                  </p>
                </div>
                <div class="data">
                  <p>
                    39,500
                  </p>

                  <div class="range">
                    <div class="fill">
                    </div>
                  </div>
                </div>
              </div>

              <div className="currency-card">
                <div>
                  <strong>+</strong>
                </div>
                <p>Gasta, recibe y ahorra en la divisa que necesites.</p>
              </div>
            </div>
            <div className="transactions">
              <h3>Transacciones</h3>
              <ul>
                <li>
                  <span>Karen Sanchez</span>
                  <span>1 EUR</span>
                </li>
                <li>
                  <span>Mery Janeth Mujica Rivero</span>
                  <span>740 EUR</span>
                </li>
                <li>
                  <span>ROSY NATALY CATALDO</span>
                  <span>+230 EUR</span>
                </li>
              </ul>
            </div>
            <div className="recent-contacts">
              <h3>Contactos recientes</h3>
              <ul>
                <li>
                  <img
                    className="recent-contacts-photo"
                    src="https://media.telefonicatech.com/telefonicatech/uploads/2023/12/hero_post_ia_generative_ai_portrait.jpg"
                    alt="KS"
                  />
                  <span>Karen Sanchez</span>
                </li>
                <li>
                  <img
                    className="recent-contacts-photo"
                    src="https://img.freepik.com/fotos-premium/primer-plano-rostro-mujer-luz-que-entra-sus-ojos-imagen-generativa-ia_97070-4802.jpg?w=360"
                    alt="MR"
                  />
                  <span>Mery Janeth</span>
                </li>
                <li>
                  <img
                    className="recent-contacts-photo"
                    src="https://img.freepik.com/fotos-premium/hermosa-mujer-creada-inteligencia-artificial-elegante-sexy-hermosa-rubia_960020-630.jpg"
                    alt="JP"
                  />
                  <span>Jhonny José</span>
                </li>
                <li>
                  <img
                    className="recent-contacts-photo"
                    src="https://img.freepik.com/fotos-premium/retrato-joven-bombero-parado-dentro-estacion-bomberos-creada-inteligencia-artificial-generativa_762026-1480.jpg"
                    alt="JC"
                  />
                  <span>José Miguel</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeUser;
