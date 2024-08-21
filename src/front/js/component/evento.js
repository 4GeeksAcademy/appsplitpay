import React from "react";
import "../../styles/evento.css";

export const Evento = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>¡Pagar entre todos!</h3>
          <button className="close-button" onClick={onClose}>
            <strong>X</strong>
          </button>
        </div>
        <div className="modal-body">
          <form id="paymentForm">
            <label htmlFor="email">Tú y? :</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Introduce nombres o direcciones de correo"
              required
            />
            <button type="button">
              + agregar
            </button>
            <div id="emailList">
              {/* Aquí podrías mapear la lista de correos si es necesario */}
            </div>

            <label htmlFor="description">Descripción:</label>
            <input
              type="text"
              id="description"
              name="description"
              placeholder="Introduce una descripción"
              required
            />

            <div className="input-group">
              <label htmlFor="totalAmount">Monto Total:</label>
              <input
                type="number"
                id="totalAmount"
                name="totalAmount"
                placeholder="€0.00"
                required
              />
              <span className="input-group-text"><strong>Euros</strong></span>
            </div>
            <p>
              Pagado por <span className="highlight">ti</span> y dividido{" "}
              <span className="highlight">a partes iguales</span>
            </p>

            <input type="date" id="paymentDate" name="paymentDate" required />
            <button type="button" className="note-button">
              Añadir imagen/notas
            </button>

            <div className="modal-footer">
              <button type="button" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Evento;
