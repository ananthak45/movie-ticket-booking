// src/Home.js
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { useNavigate } from 'react-router-dom'; // Change to useNavigate

const Home = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]); // New state to store all movies
  const [genres, setGenres] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedTheater, setSelectedTheater] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/movies');
        const data = await response.json();
        setMovies(data);
        setAllMovies(data); // Store all movies for filtering
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    const fetchGenres = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/genres');
        const data = await response.json();
        setGenres(data);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    const fetchTheaters = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/theaters');
        const data = await response.json();
        setTheaters(data);
      } catch (error) {
        console.error('Error fetching theaters:', error);
      }
    };

    fetchMovies();
    fetchGenres();
    fetchTheaters();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const formatTime = (timeString) => {
    const date = new Date(`1970-01-01T${timeString}Z`);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = String(minutes).padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const applyFilters = (e) => {
    e.preventDefault();
    const filteredMovies = allMovies.filter(movie => {
      return (selectedGenre === '' || movie.genre === selectedGenre) && 
             (selectedTheater === '' || movie.theatername === selectedTheater);
    });
    setMovies(filteredMovies);
  };

  return (
    <div>
      <header className="bg-primary text-white text-center p-3">
        <h1>Movie Ticket Booking</h1>
        <aside className="col-md-3 bg-light p-3 border-5px filter-sidebar">
          <h3 className="text-black">Filter</h3>
          <form onSubmit={applyFilters}>
            <div className="form-group text-black">
              <label htmlFor="genre">Genre</label>
              <select 
                className="form-control" 
                id="genre" 
                value={selectedGenre} 
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                <option value="">Select Genre</option>
                {genres.map((genre, index) => (
                  <option key={index} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            <div className="form-group text-black">
              <label htmlFor="theater">Theater Name</label>
              <select 
                className="form-control" 
                id="theater" 
                value={selectedTheater} 
                onChange={(e) => setSelectedTheater(e.target.value)}
              >
                <option value="">Select Theater</option>
                {theaters.map((theater, index) => (
                  <option key={index} value={theater}>{theater}</option>
                ))}
              </select>
            </div>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!(selectedGenre || selectedTheater)} 
            >
              Apply Filters
            </button>
          </form>
        </aside>
      </header>

      <div className="container">
        <h2 align="center">Available Movies</h2>
        <br></br>
        <div id="movies" className="row">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <div key={movie.id} className="col-md-4 mb-4">
                <div className="card">
                  <img src={movie.movieLink} className="card-img-top" alt={movie.movieName} />
                  <div className="card-body">
                    <h5 className="card-title">{movie.movieName}</h5>
                    <p className="card-text"><strong>Theater:</strong> {movie.theatername}</p>
                    <p className="card-text"><strong>Actors:</strong> {movie.actorsList}</p>
                    <p className="card-text"><strong>Genre:</strong> {movie.genre}</p>
                    <p className="card-text"><strong>Show Start Date:</strong> {formatDate(movie.showStartDate)}</p>
                    <p className="card-text"><strong>Show End Date:</strong> {formatDate(movie.showEndDate)}</p>
                    <p className="card-text"><strong>Show Times:</strong> {formatTime(movie.showStartTime)} - {formatTime(movie.showEndTime)}</p>
                    <p className="card-text"><strong>Ticket Price:</strong> ${movie.ticketPrice}</p>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => {
                        // Use useNavigate hook to navigate
                        navigate(`/movie/${movie.id}`);
                      }}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-danger">No movies available for the selected filters.</p>
          )}
        </div>
      </div>

      <footer className="bg-dark text-white text-center p-3">
        <p>&copy; 2024 Movie Booking App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
