import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../store/appContext';

const RequestPasswordRecovery = () => {
  const { actions } = useContext(Context);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const responseMessage = await actions.requestPasswordRecovery(email);
      setMessage(responseMessage.msg); // Ajustado para usar 'msg'
    } catch (err) {
      setError(err.message || 'Error al solicitar la recuperación de contraseña.');
    }
  };

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 6000); // 6 segundos

      return () => clearTimeout(timer); // Limpiar el temporizador en desmontaje
    }
  }, [message, error]);

  return (
    <div className="card d-flex justify-content-center my-5 p-5 mx-auto" style={{ maxWidth: '600px', fontFamily: 'Trebuchet MS' }}>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-outline mb-4">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary btn-block mb-4 mt-4">Send confirmation email</button>
      </form>
    </div>
  );
};

export default RequestPasswordRecovery;
