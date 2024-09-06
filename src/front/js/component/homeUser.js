import React, { useContext, useState, useEffect } from "react";
import Select from 'react-select'
import { Context } from "../store/appContext.js";
import { Navigate, useNavigate } from "react-router-dom";
import "../../styles/homeUser.css";

const HomeUser = () => {
  const { store, actions } = useContext(Context);
  const Navigate = useNavigate();

  const handleButton = (url) => {
    Navigate(url)
  }


  return (

    <div className="container mb-5">
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card cuadricula">
            <div className="card-body">
              <h1 className="card-title text-center mb-4">¡Bienvenido otra vez!</h1>
              <h5 className="card-text text-center mb-4">¿que quieres hacer ahora?</h5>
              <p className="card-text">Servicio disponible</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card cuadricula">
            <div className="card-body">
              <div className="col">
                  <div className="card-body">
                    <h5 className="card-text text-center">Controla como quieres solicitar tus pagos</h5>
                  </div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <button className="btn btn-primary m-2" onClick={() => handleButton('/individualPayment')}>Solicitud de pago</button>
                <button className="btn btn-primary m-2" onClick={() => handleButton('/groupPayment')}>Solicitud de pago grupal</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card cuadricula">
            <div className="card-body">
              <h5 className="card-title">Recomiéndanos y llévate 5€</h5>
              <p className="card-text">Máx. 5 personas. solicitud min. de 10 € en 30 días.</p>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <button className="btn btn-primary">Invitar a amigos</button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card cuadricula">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
              <h3 className="card-title text-center mb-4">¿le has vuelto a brindar?</h3>
              </div>
              <div className="row mt-3">
                <div className="col-md-6">
                  <div className="card text-center">
                    <div className="card-body">
                      <i className="bi bi-shop"></i>
                      <p className="card-text">maik</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card text-center">
                    <div className="card-body">
                      <i className="bi bi-search"></i>
                      <p className="card-text">sebastian</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-12">
                  <h5 className="card-title">rapido y sencillo</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default HomeUser;
