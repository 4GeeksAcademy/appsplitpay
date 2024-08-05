import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";

export const Home = () => {
  const { store, actions } = useContext(Context);

  return (
    <div className="container">
      <div className="row">
        <div className="col-3 .col-sm-4">
          <div className="sidebar">
            <ul>
              <li className="active">
                {" "}
                <i class="fa-solid fa-house"></i> Inicio
              </li>
              <li>
                <i className="fa-regular fa-credit-card"></i> Tarjeta
              </li>
              <li>
                <i className="fa-solid fa-people-arrows"></i> Destinatarios
              </li>
              <li>
                <i className="fa-solid fa-file-invoice-dollar"></i> Pagos
              </li>
            </ul>
          </div>
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
              <div className="currency-card">
                <div>
                  <img
                    src="/workspaces/appsplitpay/src/front/img/pngegg.png"
                    alt="EUR"
                  />
                </div>
                <h3>EUR</h3>
                <p>2,07</p>
              </div>
              <div className="currency-card">
                <div>
                  <img
                    src="/workspaces/appsplitpay/src/front/img/pngegg (1).png"
                    alt="USD"
                  />
                </div>
                <h3>USD</h3>
                <p>0,00</p>
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
                    src="https://via.placeholder.com/50"
                    alt="KS"
                  />
                  <span>Karen Sanchez</span>
                </li>
                <li>
                  <img
                    className="recent-contacts-photo"
                    src="https://via.placeholder.com/50"
                    alt="MR"
                  />
                  <span>Mery Janeth</span>
                </li>
                <li>
                  <img
                    className="recent-contacts-photo"
                    src="https://via.placeholder.com/50"
                    alt="JP"
                  />
                  <span>Jhonny José</span>
                </li>
                <li>
                  <img
                    className="recent-contacts-photo"
                    src="https://via.placeholder.com/50"
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
