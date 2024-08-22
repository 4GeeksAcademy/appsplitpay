import React from "react";
import "../../styles/evento.css";

export const Evento = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block' }} aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">¡Pagar entre todos!</h5>
          <button type="button" className="close" aria-label="Close" onClick={onClose}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <form id="paymentForm">
            <label htmlFor="email">Tú y? :</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="Introduce nombres o direcciones de correo"
              required
            />
            <button type="button" className="btn btn-primary mt-2">
              + agregar
            </button>
            <div id="emailList" className="mt-2">
              {/* Email list items */}
            </div>

            <label htmlFor="description" className="mt-3">Descripción:</label>
            <input
              type="text"
              id="description"
              name="description"
              className="form-control"
              placeholder="Introduce una descripción"
              required
            />

            <div className="input-group mt-3">
              <label htmlFor="totalAmount" className="input-group-text">Monto Total:</label>
              <input
                type="number"
                id="totalAmount"
                name="totalAmount"
                className="form-control"
                placeholder="€0.00"
                required
              />
              <span className="input-group-text"><strong>Euros</strong></span>
            </div>

            <p className="mt-3">
              Pagado por <span className="highlight">ti</span> y dividido{" "}
              <span className="highlight">a partes iguales</span>
            </p>

            <input type="date" id="paymentDate" name="paymentDate" className="form-control mt-2" required />
            <button type="button" className="btn btn-secondary mt-2">
              Añadir imagen/notas
            </button>
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">Guardar</button>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Evento;
