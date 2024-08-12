import React, { useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { differenceInYears } from 'date-fns';


const SignUp = () => {
  const [username, setUsername] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [age, setAge] = useState("")
  const [address, setAddress] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [selectedDate, setSelectedDate] = useState(null);
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      const calculatedAge = differenceInYears(new Date(), date);
      setAge(calculatedAge);
    }
    else { setAge(null); }
  };



  return (
    <div className="card d-flex justify-content-center my-5 p-5 mx-auto" style={{ maxWidth: '600px' }}>
      <form>
        <div className="text-center mb-3">
          <p>Sign up with:</p>
          <button data-mdb-ripple-init type="button" className="btn btn-secondary btn-floating mx-1">
            <i className="fab fa-facebook-f"></i>
          </button>

          <button data-mdb-ripple-init type="button" className="btn btn-secondary btn-floating mx-1">
            <i className="fab fa-google"></i>
          </button>

          <button data-mdb-ripple-init type="button" className="btn btn-secondary btn-floating mx-1">
            <i className="fab fa-twitter"></i>
          </button>

          <button data-mdb-ripple-init type="button" className="btn btn-secondary btn-floating mx-1">
            <i className="fab fa-github"></i>
          </button>

        </div>

        <p className="text-center">or:</p>

        {/* <!-- FirstName input --> */}
        <div data-mdb-input-init className="form-outline mb-4">
          <input onChange={(e) => setFirstName(e.target.value)} type="text" id="registerName" className="form-control" />
          <label className="form-label" htmlFor="registerName">First Name</label>
        </div>

        {/* <!-- lastName input --> */}
        <div data-mdb-input-init className="form-outline mb-4">
          <input onChange={(e) => setLastName(e.target.value)} type="text" id="registerName" className="form-control" />
          <label className="form-label" htmlFor="registerName">last Name</label>
        </div>

        {/* <!-- Username input --> */}
        <div data-mdb-input-init className="form-outline mb-4">
          <input onChange={(e) => setUsername(e.target.value)} type="text" id="registerUsername" className="form-control" />
          <label className="form-label" htmlFor="registerUsername">Username</label>
        </div>

        {/* <!-- Email input --> */}
        <div data-mdb-input-init className="form-outline mb-4">
          <input onChange={(e) => setEmail(e.target.value)} type="email" id="registerEmail" className="form-control" />
          <label className="form-label" htmlFor="registerEmail">Email</label>
        </div>
        {/* <!-- Age input --> */}
        <div data-mdb-input-init className="form-outline mb-4">
          <label className="form-label" htmlFor="registerEmail">Age</label>
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
        {/* <!-- Addres input --> */}
        <div data-mdb-input-init className="form-outline mb-4">
          <input onChange={(e) => setAddress(e.target.value)} type="text" id="registerAddres" className="form-control" />
          <label className="form-label" htmlFor="registerEmail">Addres</label>
        </div>


        {/* <!-- Password input --> */}
        <div data-mdb-input-init className="form-outline mb-4">
          <input onChange={(e) => setPassword(e.target.value)} type="password" id="registerPassword" className="form-control" />
          <label className="form-label" htmlFor="registerPassword">Password</label>
        </div>

        {/* <!-- Repeat Password input --> */}
        <div data-mdb-input-init className="form-outline mb-4">
          <input type="password" id="registerRepeatPassword" className="form-control" />
          <label className="form-label" htmlFor="registerRepeatPassword">Repeat password</label>
        </div>

        {/* <!-- Checkbox --> */}
        <div className="form-check d-flex justify-content-center mb-4">
          <input
            className="form-check-input me-2"
            type="checkbox"
            value=""
            id="registerCheck"
            checked
            aria-describedby="registerCheckHelpText"
          />
          <label className="form-check-label" htmlFor="registerCheck">
            I have read and agree to the terms
          </label>
        </div>

        {/* <!-- Submit button --> */}
        <button data-mdb-ripple-init type="submit" className="btn btn-primary btn-block mb-3">Sign up</button>
      </form >
    </div >
  );
};

export default SignUp;
