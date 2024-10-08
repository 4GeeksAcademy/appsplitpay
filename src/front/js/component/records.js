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
    <div className="container conteinerRecords border mb-5 mt-5" id="conteinerRecords">
      <div className="alert alert-dark" role="alert" id="text">
        here you can get a list with your most recent movements
      </div>
      <h1 className="tittleRecords">Your latest activities</h1>
      <table className="table" id="recordsTable">
        <thead>
          <tr>
            <th className="thRecords">ID</th>
            <th className="thRecords">Monto</th>
            <th className="thRecords">Usuario</th>
            <th className="thRecords">Grupo</th>
            <th className="thRecords">Event</th>
            <th className="thRecords">Paypal</th>
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? (
            payments.map((payment, index) => (
              <tr key={index}>
                <td className="tdRecords"><strong>{payment.id}</strong></td>
                <td className="tdRecords"><strong>{payment.amount}</strong></td>
                <td className="tdRecords"><strong>{payment.user_id}</strong></td>
                <td className="tdRecords"><strong>{payment.group_name}</strong></td>
                <td className="tdRecords"><strong>{payment.event_name}</strong></td>
                <td className="tdRecords"><strong>{payment.paypal_username}</strong></td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="tdRecords"><strong>.............</strong></td>
              <td className="tdRecords"><strong>.............</strong></td>
              <td className="tdRecords"><strong>.............</strong></td>
              <td className="tdRecords"><strong>.............</strong></td>
              <td className="tdRecords"><strong>.............</strong></td>
              <td className="tdRecords"><strong>.............</strong></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Records;


