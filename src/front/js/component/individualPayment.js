import React, { useContext, useState, useEffect } from "react";
import Select from 'react-select';
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";
import "../../styles/records.css";

const IndividualPayment = () => {
    const { store, actions } = useContext(Context);
    const [amount, setAmount] = useState("");
    const [selectedContact, setSelectedContact] = useState(null);
    const [paypal_username, setPaypal_Username] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [contactsUserNames, setContactsUserNames] = useState([]);
  
    useEffect(() =>{
      actions.getContacts()
    }, [])

    useEffect(() => {
      if (store.contacts.length != 0) {
        let usernames = store.contacts.map(contact => {
          return {
            value: contact.id, label: contact.username
          }
        })
        setContactsUserNames(usernames)
      }
    }, [store.contacts])
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const data = {
          amount: amount,
          user_id: store.user_id,
          paypal_username: paypal_username,
          contact_id: selectedContact,
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
      <h1>Solicitar Pago</h1>
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
          <label htmlFor="contacts">Contacto</label>
          <Select options={contactsUserNames}
            value={selectedContact && { value: selectedContact, label: contactsUserNames.find(contact => contact.value === selectedContact).label }}
            onChange={(option) => setSelectedContact(option.value)}
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

export default IndividualPayment;
