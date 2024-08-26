import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Context } from '../store/appContext';

const PasswordRecovery = () => {
  const { store, actions } = useContext(Context);
  const [params] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const navigate = useNavigate();

  async function submitForm(e) {
    e.preventDefault();

    if (password !== passwordConfirm) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    try {
      let baseURL = process.env.BACKEND_URL;
      console.log(baseURL)
      let resp = await fetch(baseURL + "/api/changepassword", {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + params.get("token")
        },
        body: JSON.stringify({ password })
      });
      console.log("Response status:", resp.status);
      console.log("Response:", resp);

      if (resp.ok) {
        console.log("Contraseña cambiada exitosamente");
        navigate("/");
      } else {
        setErrorMessage("Ocurrió un error al cambiar la contraseña.");
      }
    } catch (error) {
      setErrorMessage("Error al conectar con el servidor.");
      console.error("Error:", error);
    }
  }

  return (
    <div className="card d-flex justify-content-center my-5 p-5 mx-auto" style={{ maxWidth: '600px', fontFamily: 'Trebuchet MS' }}>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form onSubmit={submitForm}>
        <div className="form-outline mb-4">
          <input
            type="password"
            id="form2Example1"
            className="form-control"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label className="form-label" htmlFor="form2Example1"></label>
        </div>
        <div className="form-outline mb-4">
          <input
            type="password"
            id="form2Example2"
            className="form-control"
            placeholder="Repita su contraseña"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
          />
          <label className="form-label" htmlFor="form2Example2"></label>
        </div>
        <button type="submit" className="btn btn-primary btn-block mb-4 mt-4">
          Cambiar contraseña
        </button>
      </form>
    </div>
  );
};

export default PasswordRecovery;
