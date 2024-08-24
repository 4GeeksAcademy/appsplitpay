import React, { useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Context } from '../store/appContext';

const PasswordRecovery = () => {
  const { store, actions } = useContext(Context);
  const [params, setParams] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();


async function submitForm(e) {
    e.preventDefault();
    let formData = new FormData(e.target);
    let password = formData.get("password");
    let passwordConfirm = formData.get("passwordConfirm");
    if (password == passwordConfirm){
    navigate("/")
  }else{

    console.log("claves invalidas")
  }
    let baseURL = process.env.BACKEND_URL;

    let resp=await fetch(baseURL + "/api/changepassword", {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        "Authorization": "Bearer " + params.get("token")
      },
      body: JSON.stringify({ password })
    });

    if (resp.ok) {
      console.log("clave cambiada")
    }else{
      console.log("clave invalida")
    }
    //   try {
    //     const success = await actions.requestPasswordRecovery(email);
    //     if (success) {
    //       setMessage("Correo enviado con las instrucciones para cambiar la contraseña.");
    //     } else {
    //       setError("Error al enviar el correo.");
    //     }
    //   } catch (err) {
    //     setError(err.message || 'Error al solicitar la recuperación de contraseña.');
    //   }
    // } else {
    //   console.log("Las contraseñas no coinciden.");
    //   setError("Las contraseñas no coinciden.");
    // }
  };

  return (
    <div className="card d-flex justify-content-center my-5 p-5 mx-auto" style={{ maxWidth: '600px', fontFamily: 'Trebuchet MS' }}>
      <p> token: {params.get("token")}</p>
    <form onSubmit={submitForm}>
      {/* Mostrar mensaje de error si existe */}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      {/* Email input */}
      <div className="form-outline mb-4">
        <input 
          // onChange={(e) => setUsername(e.target.value)} 
          type="password" 
          id="form2Example1" 
          className="form-control" 
          required 
        />
        <label className="form-label" htmlFor="form2Example1">Nueva contraseña</label>
      </div>

      {/* Password input */}
      <div className="form-outline mb-4">
        <input 
          onChange={(e) => setPassword(e.target.value)} 
          type="password" 
          id="form2Example2" 
          className="form-control" 
          required 
        />
        <label className="form-label" htmlFor="form2Example2">repita su contraseña</label>
      </div>

      {/* Submit button */}
      <button type="submit" className="btn btn-primary btn-block mb-4 mt-4">
      cambiar contraseña
      </button>
    </form>
  </div>
);
};
  //   <div className="container-fluid">
  //     <p>token: {params.get("token")}</p>
  //     <h2>Recuperar Contraseña</h2>
  //     <form onSubmit={handleSubmit}>
  //       <div className="form-group">
  //         <label htmlFor="email">Correo Electrónico:</label>
  //         <input
  //           type="email"
  //           id="email"
  //           value={email}
  //           onChange={(e) => setEmail(e.target.value)}
  //           required
  //           className="form-control"
  //         />
  //       </div>
  //       <button type="submit" className="btn btn-primary">Enviar Enlace de Recuperación</button>
  //     </form>
  //     {message && <div className="alert alert-success mt-3">{message}</div>}
  //     {error && <div className="alert alert-danger mt-3">{error}</div>}
  //   </div>
  
export default PasswordRecovery;
