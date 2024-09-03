import React, { useState, useContext } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { differenceInYears } from 'date-fns';
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const { store, actions } = useContext(Context);
  const [username, setUsername] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [paypal_username, setPaypal_Username] = useState("")

  const navigate = useNavigate();

  const handleCancelButton = () => {
    navigate('/');
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      const calculatedAge = differenceInYears(new Date(), date);
      setAge(calculatedAge);
    } else {
      setAge(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    // Llamar a la acción signup
    const success = await actions.signup(username, email, password, first_name, last_name, age, address, paypal_username);

    if (success) {
      navigate("/login");
    } else {
      setErrorMessage(store.errorMessage || "An error occurred during signup.");
    }
  };

  return (
    <div className="card d-flex justify-content-center my-5 p-5 mx-auto" style={{ maxWidth: '600px', width: '100%' }}>
      <form onSubmit={handleSubmit}>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        {/* FirstName input */}
        <div className="form-outline mb-4">
          <label className="form-label" htmlFor="registerFirstName">First Name</label>
          <input
            onChange={(e) => setFirstName(e.target.value)}
            type="text"
            id="registerFirstName"
            className="form-control"
            required
          />
        </div>

        {/* lastName input */}
        <div className="form-outline mb-4">
          <label className="form-label" htmlFor="registerLastName">Last Name</label>
          <input
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
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            id="registerUsername"
            className="form-control"
            required
          />
        </div>
        
        <label  htmlFor= "paypal_user" className="form-label">Your vanity URL</label>
        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon3">https://www.paypal.com/paypalme/</span>
          <input onChange={(e) => setPaypal_Username(e.target.value)} type="text" className="form-control" id="basic-url" aria-describedby="basic-addon3"/>
        </div>

        {/* Email input */}
        <div className="form-outline mb-4">
          <label className="form-label" htmlFor="registerEmail">Email</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="registerEmail"
            className="form-control"
            required
          />
        </div>

        {/* Age input */}
        <div className="form-outline mb-4">
          <label className="form-label" htmlFor="dob">Date of Birth</label>
          <DatePicker
            id="dob"
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            maxDate={new Date()}
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={100}
            placeholderText="Selecciona tu fecha de nacimiento"
          />
        </div>

        {/* Address input */}
        <div className="form-outline mb-4">
          <label className="form-label" htmlFor="registerAddress">Address</label>
          <input
            onChange={(e) => setAddress(e.target.value)}
            type="text"
            id="registerAddress"
            className="form-control"
            required
          />
        </div>

        {/* Password input */}
        <div className="form-outline mb-4">
          <label className="form-label" htmlFor="registerPassword">Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            id="registerPassword"
            className="form-control"
            required
          />
        </div>

        {/* Repeat Password input */}
        <div className="form-outline mb-4">
          <label className="form-label" htmlFor="registerRepeatPassword">Repeat Password</label>
          <input
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            id="registerRepeatPassword"
            className="form-control"
            required
          />
        </div>

        {/* Checkbox */}
        <div className="form-check d-flex justify-content-center mb-4">
          <input
            className="form-check-input me-2"
            type="checkbox"
            id="registerCheck"
            required
          />
          <label className="form-check-label" htmlFor="registerCheck">
            I have read and agree to the terms
          </label>
        </div>

        {/* Submit button */}
        <div className="d-grid gap-2 col-6 mx-auto">
          <button type="submit" className="btn btn-primary btn-block mb-3">
            {store.loading ? "Signing up..." : "Sign up"}
          </button>
          <button type="submit" className="btn btn-outline-secondary" onClick={handleCancelButton}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;


