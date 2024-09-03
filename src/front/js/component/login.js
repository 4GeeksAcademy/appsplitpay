import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/login.css"


const Login = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCancelButton = () => {
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Llamada a la acción de login
    const success = await actions.login(email, password);

    if (success) {
      navigate("/homeUser");
    } else {
      setErrorMessage(store.errorMessage || "An error occurred during login.");
    }

    /* useEffect(() => {
      if (success != success) {
        const timer = setTimeout(() => {
          setErrorMessage("");
        }, 6000);
        return () => clearTimeout(timer);
      }
    }, [errorMessage]); */
  };


  return (
    <div className="card d-flex justify-content-center my-5 p-5 mx-auto" style={{ maxWidth: '600px', fontFamily: 'Trebuchet MS', width: '100%' }}>
      <form onSubmit={handleSubmit}>

        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}


        <div className="form-outline mb-4">
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="form2Example1"
            className="form-control"
            required
          />
          <label className="form-label" htmlFor="form2Example1" placeholder="Email">Email</label>
        </div>


        <div className="form-outline mb-4">
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            id="form2Example2"
            className="form-control"
            required
          />
          <label className="form-label" htmlFor="form2Example2">Password</label>
        </div>


        <div className="row mb-4">
          <div className="col d-flex justify-content-center">
            {/* Checkbox */}
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="form2Example34"
                defaultChecked
              />
              <label className="form-check-label" htmlFor="form2Example34">
                Remember me
              </label>
            </div>
          </div>

          <div className="col">
            <Link to="/requestPasswordRecovery">recupera tu contraseña</Link>
          </div>
        </div>

        <div className="text-center">
          <p>
            Not a member? <Link to="/signup">Register</Link>
          </p>
        </div>

        <div className="d-grid gap-2 col-6 mx-auto">
          <button type="submit" className="btn btn-primary btn-block ">
            Login
          </button>
          <button type="submit" className="btn btn-outline-secondary" onClick={handleCancelButton}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
