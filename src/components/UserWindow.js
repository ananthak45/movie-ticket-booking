import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function UserWindow() {
  const { userid } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const [theaterDetails, setTheaterDetails] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [movieDetails, setMovieDetails] = useState({
    movieName: "",
    actors: "",
    genre: "",
    movieLink: "",
    showStartDate: "",
    showEndDate: "",
    showStartTime: "",
    showEndTime: "",
    ticketAmount: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTheaterDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/theaters/${userid}`);
        setTheaterDetails(response.data);
      } catch (error) {
        console.error("Error fetching theater details:", error);
      }
    };

    fetchTheaterDetails();
  }, [userid]);

  const handleAddMovie = async () => {
    const { movieName, actors, genre, movieLink, showStartDate, showEndDate, showStartTime, showEndTime, ticketAmount } = movieDetails;

    if (!movieName || !actors || !genre || !movieLink || !showStartDate || !showEndDate || !showStartTime || !showEndTime || !ticketAmount) {
      alert("All fields are required.");
      return;
    }

    if (ticketAmount <= 0) {
      alert("Ticket amount must be a positive number.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`http://localhost:5000/api/movies/add`, {
        ...movieDetails,
        theatername: theaterDetails?.theatername,
      });

      if (response.data.success) {
        setShowPopup(false);
        setMovieDetails({
          movieName: "",
          actors: "",
          genre: "",
          movieLink: "",
          showStartDate: "",
          showEndDate: "",
          showStartTime: "",
          showEndTime: "",
          ticketAmount: "",
        });
      }
    } catch (error) {
      console.error("Error adding movie:", error);
      setError("Failed to add movie. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4">
          <div className="card p-3">
            <h3 className="card-title">Theater Details</h3>
            {theaterDetails ? (
              <div>
                <p><strong>User ID:</strong> {theaterDetails.userid}</p>
                <p><strong>Theater Name:</strong> {theaterDetails.theatername}</p>
                <p><strong>Owner Name:</strong> {theaterDetails.ownername}</p>
                <p><strong>Address:</strong> {theaterDetails.address}</p>
                <p><strong>Phone:</strong> {theaterDetails.phone}</p>
                <p><strong>Email:</strong> {theaterDetails.email}</p>
                <p><strong>Instagram:</strong> {theaterDetails.instagram}</p>
                {/* Move the button here */}
                <button
                  className="btn btn-primary mt-3"
                  onClick={() => navigate("/")}
                >
                  LogOut
                </button>
              </div>
            ) : (
              <p>Loading theater details...</p>
            )}
          </div>
        </div>

        <div className="col-md-8">
          <div className="card p-3">
            <h3 className="card-title">Add Movie</h3>
            <button
              className="btn btn-primary float-end mb-3"
              onClick={() => setShowPopup(true)}
            >
              Add Movie
            </button>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Movie</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPopup(false)}
                ></button>
              </div>
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}
                <form>
                  {["movieName", "actors", "genre", "movieLink", "showStartDate", "showEndDate", "showStartTime", "showEndTime", "ticketAmount"].map((field, index) => (
                    <div className="mb-3" key={index}>
                      <label className="form-label">
                        {field === "movieLink"
                          ? "Movie Image Link"
                          : field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                      </label>
                      <input
                        type={field.includes("Date") ? "date" : field.includes("Time") ? "time" : field === "ticketAmount" ? "number" : "text"}
                        className="form-control"
                        value={movieDetails[field]}
                        onChange={(e) => setMovieDetails({ ...movieDetails, [field]: e.target.value })}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAddMovie}
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add Movie"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserWindow;
