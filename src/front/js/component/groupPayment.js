import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js";
import Select from 'react-select'
import { useNavigate } from "react-router-dom";
import "../../styles/records.css";
import reactSelect from "react-select";

const groupPayment = () => {
    const { store, actions } = useContext(Context);
    const [amount, setAmount] = useState("");
    const [userAllGroup, setUserAllGroup] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groupAllEvents, setGroupAllEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [paypal_username, setPaypal_Username] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() =>{
      actions.getUserGroups()
    }, [])
  
    useEffect(() => {
      if (store.groups.length != 0) {
        let groups = store.groups.map(group => {
          return {
            value: group.id, label: group.name
          }
        })
        setUserAllGroup(groups)
      }
    }, [store.groups])
  
    useEffect(() => {
      if (selectedGroup) actions.getAllEvents(selectedGroup)
    }, [selectedGroup])
  
    useEffect(() => {
      if (store.events.length != 0) {
        let events = store.events.map(event => {
          return {
            value: event.id, label: event.name
          }
        })
        setGroupAllEvents(events)
      }
    }, [store.events])
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const data = {
          amount: amount,
          user_id: store.user_id,
          paypal_username: paypal_username,
          group_id: selectedGroup,
          event_id: selectedEvent,
        };

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
      <h1>Solicitar Pago a Grupo</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">Monto</label>
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            className="form-control"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="groups">Grupos</label>
          <Select options={userAllGroup}
            value={userAllGroup.find(group => group.value === selectedGroup)}
            onChange={(option) => setSelectedGroup(option.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="eventId">Evento</label>
          <Select options={groupAllEvents}
            value={groupAllEvents.find(event => event.value === selectedEvent)}
            onChange={(option) => {
              setSelectedEvent(option.value);
            }}
          />
        </div>
        <label htmlFor="paypal_username" className="form-label">Nombre de usuario de PayPal</label>
        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon3">https://www.paypal.com/paypalme/</span>
          <input
            type="text"
            className="form-control"
            id="paypal_username"
            value={paypal_username}
            onChange={(e) => setPaypal_Username(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Solicitar Pago
        </button>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
      </form>
    </div>
  );
};
  
  export default groupPayment;



