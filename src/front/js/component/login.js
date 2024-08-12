import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault();

    // Aquí puedes agregar la lógica de autenticación
    // Una vez autenticado, redirigir a la ruta deseada
    navigate("/HomeUser");
  };

  return (
    <div className="card d-flex justify-content-center my-5 p-5 mx-auto" style={{ maxWidth: '600px', fontFamily: 'Trebuchet MS' }}>
      <form onSubmit={handleSubmit}>
        {/* Email input */}
        <div className="form-outline mb-4">
          <input onChange={(e) => setUsername(e.target.value)} type="email" id="form2Example1" className="form-control" required />
          <label className="form-label" htmlFor="form2Example1">
            Email address
          </label>
        </div>

        {/* Password input */}
        <div className="form-outline mb-4">
          <input onChange={(e) => setPassword(e.target.value)} type="password" id="form2Example2" className="form-control" required />
          <label className="form-label" htmlFor="form2Example2">
            Password
          </label>
        </div>

        {/* 2 column grid layout for inline styling */}
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
            {/* Simple link */}
            <a href="#!">Forgot password?</a>
          </div>
        </div>

        {/* Submit button */}
        <button type="submit" className="btn btn-primary btn-block mb-4 mt-4">
          Sign in
        </button>

        {/* Register buttons */}
        <div className="text-center">
          <p>
            Not a member? <a href="/signup">Register</a>
          </p>
          <p>or sign up with:</p>
          <button type="button" className="btn btn-secondary btn-floating mx-1">
            <i className="fab fa-facebook-f"></i>
          </button>
          <button type="button" className="btn btn-secondary btn-floating mx-1">
            <i className="fab fa-google"></i>
          </button>
          <button type="button" className="btn btn-secondary btn-floating mx-1">
            <i className="fab fa-twitter"></i>
          </button>
          <button type="button" className="btn btn-secondary btn-floating mx-1">
            <i className="fab fa-github"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;