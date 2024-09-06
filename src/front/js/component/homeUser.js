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

    <div className="container">
      <div className="table-responsive">
        <h1>Home User</h1>
        <button className="btn btn-primary m-2" onClick={() => handleButton('/individualPayment')}>Solicitud de pago</button>
        <button className="btn btn-primary m-2" onClick={() => handleButton('/groupPayment')}>Solicitud de pago grupal</button>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">First</th>
              <th scope="col">Last</th>
              <th scope="col">Handle</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};


export default HomeUser;
