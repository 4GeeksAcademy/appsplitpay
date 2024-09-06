import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/contacts.css";
import { useNavigate } from "react-router-dom";

export const Profile = () => {

    const [username, setUsername] = useState("");
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [paypal_username, setPaypal_Username] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    
    useEffect(() => {
        actions.getUserInfo();
    }, []);

    const handleCancelButton = () => {
        navigate('/');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await actions.updateUser(first_name, last_name, username, paypal_username, email, address);

        if (success) {
            navigate("/homeUser");
        } else {
            setErrorMessage(store.errorMessage || "An error occurred during updating.");
        }
    };


    /* address: "Cambre", age: "28", email: "juanse2929@gmail.com", first_name: "Sebastian", id: 1, is_active: true, last_name: "Solano", paypal_username: "sbs29", username: "sebas29"
 */
    return (
        <div className="card d-flex justify-content-center my-5 p-5 mx-auto" style={{ maxWidth: '600px', width: '100%' }}>
            <form onSubmit={handleSubmit}>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                <div className="form-outline mb-4">
                    <h1>Personal Data</h1>
                </div>

                {/* FirstName input */}
                <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="registerFirstName">First Name</label>
                    <input
                        value={store.dataUserDb ? store.dataUserDb.first_name : ""}
                        onChange={(e) => setFirstName(e.target.value)}
                        type="text"
                        id="registerFirstName"
                        className="form-control"
                        
                    />
                </div>

                {/* lastName input */}
                <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="registerLastName">Last Name</label>
                    <input
                        value={store.dataUserDb ? store.dataUserDb.last_name : ""}
                        onChange={(e) => setLastName(e.target.value)}
                        type="text"
                        id="registerLastName"
                        className="form-control"
                        required
                    />
                </div>

                {/* Username input */}
                <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="registerUsername">Username</label>
                    <input
                        value={store.dataUserDb ? store.dataUserDb.username : ""}
                        onChange={(e) => setUsername(e.target.value)}
                        type="text"
                        id="registerUsername"
                        className="form-control"
                        required
                    />
                </div>

                {/* Paypal username input */}
                <label htmlFor="paypal_user" className="form-label">Your vanity URL</label>
                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon3">https://www.paypal.com/paypalme/</span>
                    <input 
                        value={store.dataUserDb ? store.dataUserDb.paypal_username : ""}
                        onChange={(e) => setPaypal_Username(e.target.value)} 
                        type="text" 
                        className="form-control" 
                        id="basic-url" 
                        aria-describedby="basic-addon3"
                        required 
                    />
                </div>

                {/* Email input */}
                <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="registerEmail">Email</label>
                    <input
                        value={store.dataUserDb ? store.dataUserDb.email : ""}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        id="registerEmail"
                        className="form-control"
                        required
                    />
                </div>

                {/* Address input */}
                <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="registerAddress">Address</label>
                    <input
                        value={store.dataUserDb ? store.dataUserDb.address : ""}
                        onChange={(e) => setAddress(e.target.value)}
                        type="text"
                        id="registerAddress"
                        className="form-control"
                        required
                    />
                </div>

                {/* Submit button */}
                <div className="d-grid gap-2 col-6 mx-auto">
                    <button type="submit" className="btn btn-success btn-block mb-3">
                        {store.loading ? "Updating..." : "Update"}
                    </button>
                    <button type="submit" className="btn btn-outline-danger" onClick={handleCancelButton}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
