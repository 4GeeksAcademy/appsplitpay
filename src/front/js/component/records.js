import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";
import "../../styles/records.css";

const Records = () => {
    const { store, actions } = useContext(Context);
  
    const [payments, setPayments] = useState([]);
    // const [groups, setGroups] = useState({});
    // const [events, setEvents] = useState({});
  
    useEffect(() => {
      actions.getPayments()
        .then((payments) => {
           setPayments(payments)
        })
        .catch((error) => {
          console.error(error);
        });
    }, []);


    // useEffect(() => {
  //   if (store.users.length != 0) {
  //     let users = store.users.map(user => {
  //       return {
  //         value: user.id, label: user.name
  //       }
  //     })
  //     setUserAllUser(users)
  //   }
  // }, [store.users])

  // useEffect(() => {
  //   if (store.groups.length != 0) {
  //     let groups = store.groups.map(group => {
  //       return {
  //         value: group.id, label: group.name
  //       }
  //     })
  //     setUserAllGroup(groups)
  //   }
  // }, [store.groups])

  // useEffect(() => {
  //   if (store.events.length != 0) {
  //     let events = store.events.map(event => {
  //       return {
  //         value: event.id, label: event.name
  //       }
  //     })
  //     setGroupAllEvents(events)
  //   }
  // }, [store.events])
  
    return (
      <div className="container border">
      <h1>Estas en el componente Records</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Monto</th>
            <th>Usuario</th>
            <th>Grupo</th>
            <th>Event</th>
            <th>Paypal</th>
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? (
            payments.map((payment, index) => (
              <tr key={index}>
                <td><strong>{payment.id}</strong></td>
                <td><strong>{payment.amount}</strong></td>
                <td><strong>{payment.user_id}</strong></td>
                <td><strong>{payment.group_name}</strong></td>
                <td><strong>{payment.event_name}</strong></td>
                <td><strong>{payment.paypal_username}</strong></td>
              </tr>
            ))
          ) : (
            <tr>
              <td><strong>.............</strong></td>
              <td><strong>.............</strong></td>
              <td><strong>.............</strong></td>
              <td><strong>.............</strong></td>
              <td><strong>.............</strong></td>
              <td><strong>.............</strong></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    );
  };
  
  export default Records;


