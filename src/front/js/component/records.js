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
          setPayments(payments);
        })
        .catch((error) => {
          console.error(error);
        });
    }, []);
  
    // const handleGetPayment = async (paymentId) => { SE MANTIENE EL HANDLE EN CASO DE QUERER AGREGAR UN BOTON VER DETALLES
    //   try {
    //     const payment = await actions.getPayment(paymentId);
        
    //     console.log(payment);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };
  
    return (
        <div className="container">
      <h1>Estas en el componente Records</h1>
      {payments.length > 0 ? (
        payments.map((payment, index) => (
          <div key={index} className="row mb-2">
            <div className="col-md-2">
              <strong>ID:</strong> {payment.id}
            </div>
            <div className="col-md-2">
              <strong>Monto:</strong> {payment.amount}
            </div>
            <div className="col-md-2">
              <strong>Usuario:</strong> {payment.user_id}
            </div>
            <div className="col-md-2">
              <strong>Grupo:</strong> {payment.group_id}
            </div>
            <div className="col-md-2">
              <strong>Paypal:</strong> {payment.paypal_username}
            </div>
          </div>
        ))
      ) : (
        <div className="row mb-2">
          <div className="col-md-2">
            <strong>ID:</strong> .............
          </div>
          <div className="col-md-2">
            <strong>Monto:</strong> .............
          </div>
          <div className="col-md-2">
            <strong>Usuario:</strong> .............
          </div>
          <div className="col-md-2">
            <strong>Grupo:</strong> .............
          </div>
          <div className="col-md-2">
            <strong>Paypal:</strong> .............
          </div>
        </div>
      )}
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
