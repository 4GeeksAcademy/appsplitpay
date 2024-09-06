// import React, { useState, useEffect, useContext } from "react";
// import "../../styles/evento.css";
// import { Context } from "../store/appContext.js";

// const apiUrl = process.env.BACKEND_URL + "/api";

// export const Evento = ({ isOpen, onClose }) => {
//   const { store } = useContext(Context);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [formData, setFormData] = useState({
//     description: "",
//     totalAmount: "",
//   });

//   useEffect(() => {
//     const fetchContacts = async () => {
//       if (searchTerm.trim() === "") {
//         setSearchResults([]);
//         return;
//       }

//       try {
//         const response = await fetch(`${apiUrl}/contact?search=${searchTerm}`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${store.token}`,
//           },
//         });

//         if (!response.ok) {
//           console.error("Error en la respuesta de la API:", response.statusText);
//           return;
//         }

//         const data = await response.json();
//         console.log("Resultados de la búsqueda:", data);

//         if (data.contacts && Array.isArray(data.contacts)) {
//           setSearchResults(data.contacts);
//         } else {
//           console.error("Formato de datos no esperado:", data);
//         }
//       } catch (error) {
//         console.error("Error en la solicitud de contactos:", error);
//       }
//     };

//     fetchContacts();
//   }, [searchTerm, store.token]);

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//     setSelectedUser(null); // Limpiar la selección del usuario
//   };

//   const handleUserSelect = (user) => {
//     setSelectedUser(user);
//     setSearchTerm(""); // Limpiar el campo de búsqueda
//     setSearchResults([]); // Limpiar los resultados de búsqueda
//   };

//   const handleUserDeselect = () => {
//     setSelectedUser(null); // Limpiar la selección del usuario
//     setSearchTerm(""); // Limpiar el campo de búsqueda para permitir nueva búsqueda
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!selectedUser) {
//       alert("Por favor, selecciona un usuario antes de enviar.");
//       return;
//     }


//     const dataToSend = {
//       ...formData,
//       user_id: selectedUser.id, // Añadir el ID del usuario seleccionado
//     };

//     try {
//       const response = await fetch(`${apiUrl}/payments`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${store.token}`,
//         },
//         body: JSON.stringify(dataToSend),
//       });
//       console.log(dataToSend)

//       const result = await response.json();
//       if (response.ok) {
//         alert("Evento creado y correo enviado al usuario.");
//       } else {
//         alert(`Error: ${result.error}`);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Hubo un problema al crear el evento.");
//     }

//     onClose(); // Cierra el modal después de enviar el formulario
//   };

//   if (!isOpen) {
//     return null;
//   }

//   return (
//     <div
//       className="modal fade show"
//       tabIndex="-1"
//       role="dialog"
//       style={{ display: "block" }}
//       aria-labelledby="exampleModalLabel"
//     >
//       <div className="modal-dialog" role="document">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title" id="exampleModalLabel">¡Pagar entre todos!</h5>
//             <button className="button" onClick={onClose}>
//               <span className="X"></span>
//               <span className="Y"></span>
//               <div className="close">Close</div>
//             </button>
//           </div>
//           <div className="modal-body">
//             <form id="paymentForm" onSubmit={handleSubmit}>
//               <label htmlFor="userSearch">Selecciona un Usuario:</label>
//               <input
//                 type="text"
//                 id="userSearch"
//                 name="userSearch"
//                 className="form-control"
//                 placeholder="Introduce nombre o correo del usuario"
//                 value={searchTerm}
//                 onChange={handleSearchChange}
//                 required
//               />
//               {searchResults.length > 0 && !selectedUser && (
//                 <ul className="list-group mt-2">
//                   {searchResults.map((user) => (
//                     <li
//                       key={user.id}
//                       className="list-group-item list-group-item-action"
//                       onClick={() => handleUserSelect(user)}
//                     >
//                       {user.username} - {user.email}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//               {selectedUser && (
//                 <div className="selected-user mt-2 p-2 border rounded">
//                   <strong>Usuario Seleccionado:</strong>
//                   <p>Nombre: {selectedUser.username}</p>
//                   <p>Correo: {selectedUser.email}</p>
//                   <button
//                     type="button"
//                     className="btn btn-danger mt-2"
//                     onClick={handleUserDeselect}
//                   >
//                     Eliminar Selección
//                   </button>
//                 </div>
//               )}

//               <label htmlFor="description" className="mt-3">Descripción:</label>
//               <input
//                 type="text"
//                 id="description"
//                 name="description"
//                 className="form-control"
//                 placeholder="Introduce una descripción"
//                 value={formData.description}
//                 onChange={handleChange}
//                 required
//               />

//               <div className="input-group mt-3">
//                 <label htmlFor="totalAmount" className="input-group-text">Monto Total:</label>
//                 <input
//                   type="number"
//                   id="totalAmount"
//                   name="totalAmount"
//                   className="form-control"
//                   placeholder="€0.00"
//                   value={formData.totalAmount}
//                   onChange={handleChange}
//                   required
//                 />
//                 <span className="input-group-text"><strong>Euros</strong></span>
//               </div>
//             </form>
//           </div>
//           <div className="modal-footer">
//             <button type="button" className="btn btn-secondary" onClick={onClose}>
//               Cancelar
//             </button>
//             <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Guardar</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Evento;
