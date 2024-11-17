import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddTheaterPage = () => {
  const [theaterDetails, setTheaterDetails] = useState({
    userid: "",
    password: "",
    theatername: "",
    ownername: "",
    address: "",
    phone: "",
    email: "",
    instagram: "",
  });
  const navigate = useNavigate();

  const handleAddTheater = async () => {
    try {
      await axios.post("http://localhost:5000/api/theaters/add", theaterDetails);
      navigate(`/${theaterDetails.userid}/window`);
    } catch (error) {
      console.error("Error during adding theater:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add Theater</h2>
      {Object.keys(theaterDetails).map((field) => (
        <div className="form-group" key={field}>
          <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
          <input
            type="text"
            className="form-control"
            value={theaterDetails[field]}
            onChange={(e) => setTheaterDetails({ ...theaterDetails, [field]: e.target.value })}
          />
        </div>
      ))}
      <button className="btn btn-primary mt-3" onClick={handleAddTheater}>
        Submit
      </button>
    </div>
  );
};

export default AddTheaterPage;
