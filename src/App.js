import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginPage from "./components/LoginPage";
import AddTheaterPage from "./components/AddTheaterPage";
import UserWindow from "./components/UserWindow"; // This component will be the user-specific page after login
import Home from "./components/Home";
import MovieDetails from "./components/MovieDetails";


function App() {
  return (
    
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/add-theater" element={<AddTheaterPage />} />
          <Route path="/:userid/window" element={<UserWindow />} />
          <Route path="/:phoneno/home" element={<Home />} />
          <Route path="/movie/:id" component={MovieDetails} /> {/* Route for movie details */}
     
        </Routes>
      </div>
    </Router>
  );
}

export default App;
