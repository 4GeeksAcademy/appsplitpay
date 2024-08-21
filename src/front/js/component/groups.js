// import React, { useContext } from "react";
// import { Context } from "../store/appContext";
// import { Navigate } from "react-router-dom";

// export const Groups = ()=>{
//     const {store, actions} = useContext(Context);
//     const handleNavigateToGroups = Navigate(/)

//     return (
//         <div className="modal">
//           <div className="modal-header">
//             <h3>¡Pagar entre todos!</h3>
//             <button className="close-button" onClick={closeModal}>
//               <strong>X</strong>
//             </button>
//           </div>
//           <div className="modal-body">
//             <form id="paymentForm">
//               <label htmlFor="email">Tú y? :</label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 placeholder="Introduce nombres o direcciones de correo"
//                 value={emailInput}
//                 onChange={(e) => setEmailInput(e.target.value)}
//                 required
//               />
//               <button type="button" onClick={addEmail}>
//                 + agregar
//               </button>
//               <div id="emailList">
//                 {emailList.map((email, index) => (
//                   <div key={index}>{email}</div>
//                 ))}
//               </div>
    
//               <label htmlFor="description">Descripción:</label>
//               <input
//                 type="text"
//                 id="description"
//                 name="description"
//                 placeholder="Introduce una descripción"
//                 required
//               />
    
//               <div className="input-group">
//                 <label htmlFor="totalAmount">Monto Total:</label>
//                 <input
//                   type="number"
//                   id="totalAmount"
//                   name="totalAmount"
//                   placeholder="€0.00"
//                   required
//                 />
//                 <span className="input-group-text"><strong>Euros</strong></span>
//               </div>
//               <p>
//                 Pagado por <span className="highlight">ti</span> y dividido{" "}
//                 <span className="highlight">a partes iguales</span>
//               </p>
    
//               <input type="date" id="paymentDate" name="paymentDate" required />
//               <button type="button" className="note-button">
//                 Añadir imagen/notas
//               </button>
    
//               <div className="modal-footer">
//                 <button type="button" onClick={cancel}>
//                   Cancelar
//                 </button>
//                 <button type="submit">Guardar</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       );
//     };


// }