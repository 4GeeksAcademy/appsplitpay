import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";
import "../../styles/homeUser.css";

const HomeUser = () => {
  const { store, actions } = useContext(Context);
  const [amount, setAmount] = useState("");
  const [groupId, setGroupId] = useState("");
  const [eventId, setEventId] = useState("");
  const [paypal_username, setPaypal_Username] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
  try {
    const data = {
      amount: amount,
      user_id: store.user_id,
    };

    if (groupId && eventId) {
      const group = await actions.getGroup(groupId);
      const event = await actions.getEvent(eventId);
      data.group = group;
      data.event = event;
    } else {
      data.paypal_username = paypal_username;
    }
    
      const result = await actions.createPayment(data);
      if (result) {
        setSuccess("Pago creado con éxito");
        setError(null);
      } else {
        console.error("Error creating payment:", error);
        setError("Error al crear pago");
        setSuccess(null);
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      setError("Error al crear pago 2");
      setSuccess(null);
    }
  };

  return (
    <div className="container">
    <div className="container">
      <h1>Crear Pago</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">Monto</label>
          <input
            type="number"
            className="form-control"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="groupId">ID de Grupo</label>
          <input
            type="text"
            className="form-control"
            id="groupId"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="eventId">ID de Evento</label>
          <input
            type="text"
            className="form-control"
            id="eventId"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="paypal_username">Nombre de usuario de PayPal</label>
          <input
            type="text"
            className="form-control"
            id="paypal_username"
            value={paypal_username}
            onChange={(e) => setPaypal_Username(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Crear Pago
        </button>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
      </form>
    </div>
// --------------------------------------------------------------------------------------------------------
    <div className="table-responsive">
      <h1>Estas en el component Home user</h1>
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
