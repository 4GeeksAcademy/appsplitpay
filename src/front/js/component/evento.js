import { useEffect } from "react";
import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/evento.css";
import { defaults } from "gh-pages";



export const Evento = () => {
    const { store, actions } = useContext(Context);
    return (

        <div className="modal">
            <div className="modal-header">
                <h3>¡Pagar entre todos !</h3>
                <button className="close-button" onclick="closeModal()"><strong>X</strong></button>
            </div>
            <div className="modal-body">
                <form id="paymentForm">
                    <label for="email"> Tú y? :</label>
                    <input type="email" id="email" name="email" placeholder="Introduce nombres o direcciones de correo" required />
                    <button type="button" onclick="addEmail()">+ agregar</button>
                    <div id="emailList"></div>

                    <label for="description">Descripción:</label>
                    <input type="text" id="description" name="description" placeholder="Introduce una descripción" required />




                    <div class="input-group">
                        <label for="totalAmount">Monto Total:</label>

                        <input type="number" id="totalAmount" name="totalAmount" placeholder="€0.00" required />
                        <span class="input-group-text"><strong>Euros</strong></span>
                    </div>
                    <p>Pagado por <span className="highlight">ti</span> y dividido <span className="highlight">a partes iguales</span></p>

                    <input type="date" id="paymentDate" name="paymentDate" required />
                    <button type="button" className="note-button">Añadir imagen/notas</button>

                    <div className="modal-footer">
                        <button type="button" onclick="cancel()">Cancelar</button>
                        <button type="submit">Guardar</button>
                    </div>
                </form>
            </div>
        </div>

    );
};
export default Evento;