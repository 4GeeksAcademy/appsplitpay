import React, { useState } from 'react';
import { useContext } from 'react';
import { Context } from '../store/appContext';

const RequestPasswordRecovery = () => {
  const { actions } = useContext(Context);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      // Llamada a la acción de solicitud de recuperación de contraseña
      const success = await actions.requestPasswordRecovery(email);
      if (success) {
        setMessage("Correo enviado con las instrucciones para cambiar la contraseña.");
      } else {
        setError("Error al enviar el correo.");
      }
    } catch (err) {
      setError(err.message || 'Error al solicitar la recuperación de contraseña.');
    }
  };

  return (
    <div className="container">
      <h2>Recuperar Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">Enviar Enlace de Recuperación</button>
      </form>
      {message && <div className="alert alert-success mt-3">{message}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
};

export default RequestPasswordRecovery;
