import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-dropdown-select";
import { Context } from "../store/appContext";


const DetailsGroup = () => {

    const { store, actions } = useContext(Context);
    const params = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const success = await actions.createEvent(params.id, name, amount, description);
    
        if (success) {
            console.log("Bien");
            window.location.reload(false);
        }else{
            console.log("Mal");
        }
    };

    const handleDelete=(eventId)=>{
        const success = actions.deleteEvent(params.id, eventId);

        if (success) {
            console.log("Bien");
            /* window.location.reload(false); */
            navigate("/group");
        }else{
            console.log("Mal");
        }
    }

    const handleCancel=()=>{
        navigate("/group");
    };

    useEffect(() => {
        actions.getGroupDetails(params.id);
        actions.getAllEvents(params.id);
    }, []);

    return (
        <div className="card d-flex justify-content-center my-5 p-5 mx-auto" style={{ maxWidth: '600px', fontFamily: 'Trebuchet MS', width: '100%' }}>
            <h3>create event:</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="registerFirstName">Name</label>
                    <input
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        id="registerFirstName"
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="registerFirstName">Amount</label>
                    <input
                        onChange={(e) => setAmount(e.target.value)}
                        type="text"
                        id="registerFirstName"
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="registerFirstName">Description</label>
                    <input
                        onChange={(e) => setDescription(e.target.value)}
                        type="text"
                        id="registerFirstName"
                        className="form-control"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Crear</button>
            </form>
            <h5>Events: </h5>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Description</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {store.events.length > 0 ? (
                        store.events.map((event, index) => (
                            <tr key={index}>
                                <td>{event.name}</td>
                                <td>{event.amount}</td>
                                <td>{event.description}</td>
                                <td><button onClick={() => handleDelete(event.id)} className="btn btn-outline-danger" type="buttom"> - Delete event </button></td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td>.............</td>
                            <td>.............</td>
                            <td>.............</td>
                            <td>.............</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <button className="btn btn-outline-secundary" onClick={handleCancel}>Cancel</button>
        </div>
    );



}

export default DetailsGroup;