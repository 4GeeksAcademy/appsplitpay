import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Context } from '../store/appContext';

const PasswordRecovery = () => {
  const { store, actions } = useContext(Context);
  const [params] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  async function submitForm(e) {
    e.preventDefault();

    let formData = new FormData(e.target);
    let password = formData.get("password");
    let passwordConfirm = formData.get("passwordConfirm");

    if (password !== passwordConfirm) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    try {
      let baseURL = process.env.BACKEND_URL;
      let resp = await fetch(baseURL + "/api/changepassword", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + params.get("token"),
        },
        body: JSON.stringify({ password }),
      });

      if (resp.ok) {
        console.log("Clave cambiada");
        navigate("/"); // Redirecciona a la vista de inicio
      } else {
        console.log("No es posible cambiar contraseña");
        setErrorMessage("Ocurrió un error al cambiar la contraseña.");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Error al conectar con el servidor.");
    }
  }

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <div className="card d-flex justify-content-center my-5 p-5 mx-auto" style={{ maxWidth: '600px', fontFamily: 'Trebuchet MS' }}>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form onSubmit={submitForm}>
        <div className="form-outline mb-4">
          <input
            type="password"
            id="form2Example1"
            name="password"
            className="form-control"
            placeholder="Nueva contraseña"
            required
          />
          <label className="form-label" htmlFor="form2Example1"></label>
        </div>
        <div className="form-outline mb-4">
          <input
            type="password"
            id="form2Example2"
            name="passwordConfirm"
            className="form-control"
            placeholder="Repita su contraseña"
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
