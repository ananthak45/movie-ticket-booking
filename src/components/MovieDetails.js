// src/MovieDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const MovieDetails = () => {
  const { id } = useParams(); // Get the movie ID from the URL
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/movies/${id}`); // Adjust your API endpoint
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (!movie) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container">
      <h2 className="text-center">{movie.movieName}</h2>
      <div className="card mb-3">
        <img src={movie.movieLink} className="card-img-top" alt={movie.movieName} />
        <div className="card-body">
          <p className="card-text"><strong>Theater:</strong> {movie.theatername}</p>
          <p className="card-text"><strong>Actors:</strong> {movie.actorsList}</p>
          <p className="card-text"><strong>Genre:</strong> {movie.genre}</p>
          <p className="card-text"><strong>Show Start Date:</strong> {movie.showStartDate}</p>
          <p className="card-text"><strong>Show End Date:</strong> {movie.showEndDate}</p>
          <p className="card-text"><strong>Show Times:</strong> {movie.showStartTime} - {movie.showEndTime}</p>
          <p className="card-text"><strong>Ticket Price:</strong> ${movie.ticketPrice}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
