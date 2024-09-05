import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";
import "../../styles/records.css";

const Records = () => {
    const { store, actions } = useContext(Context);
  
    const [payments, setPayments] = useState([]);
  
    useEffect(() => {
      actions.getPayments()
        .then((payments) => {
           setPayments(payments) //.map((payment) => {
          //   return {
          //     ...payment,
          //     group_name: payment.group ? payment.group.name : '',
          //     event_name: payment.event ? payment.event.name : ''
          //   };
          // }));
        })
        .catch((error) => {
          console.error(error);
        });
    }, []);


    // useEffect(() => { UNA VEZ QUE FUNCIONE GROUP Y EVENT ESTE USEEFFECT PUEDE SERVIR PARA QUE LA LISTA MUESTRE EL NOMBRE DE GRUPO Y EVENTO Y NO SU ID
    //   actions.getPayments()
    //     .then((payments) => {
    //       const promises = payments.map((payment) => {
    //         return Promise.all([
    //           actions.getGroup(payment.group_id),
    //           actions.getEvent(payment.event_id)
    //         ]).then(([group, event]) => {
    //           return {
    //             ...payment,
    //             group_name: group.name,
    //             event_name: event.name
    //           };
    //         });
    //       });
    //       Promise.all(promises).then((paymentsWithNames) => {
    //         setPayments(paymentsWithNames);
    //       });
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
    // }, []);

  
    // const handleGetPayment = async (paymentId) => { SE MANTIENE EL HANDLE EN CASO DE QUERER AGREGAR UN BOTON VER DETALLES
    //   try {
    //     const payment = await actions.getPayment(paymentId);
        
    //     console.log(payment);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };
  
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

//   #-------------------------------------------------------------------------------------------------------------------

// const Records = () => {
//   return (
//     <div className="table-responsive">
//         <h1>Estas en el component Records</h1>
//         <table className="table">
//             <thead>
//             <tr>
//                 <th scope="col">#</th>
//                 <th scope="col">First</th>
//                 <th scope="col">Last</th>
//                 <th scope="col">Handle</th>
//             </tr>
//             </thead>
//             <tbody>
//             <tr>
//                 <th scope="row">1</th>
//                 <td>Mark</td>
//                 <td>Otto</td>
//                 <td>@mdo</td>
//             </tr>
//             <tr>
//                 <th scope="row">2</th>
//                 <td>Jacob</td>
//                 <td>Thornton</td>
//                 <td>@fat</td>
//             </tr>
//             </tbody>
//         </table>
//     </div>
//   );
// };

// export default Records;
