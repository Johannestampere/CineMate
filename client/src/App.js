import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import Mood from "./moodRating";
import Genre from "./genreRating"
import TimeRating from "./timeReleased.js";
import FriendsPage from "./friendsPage.js";

const App = () => {
  return (
    <div>
        <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/vote/mood" element={<Mood/>}/>
            <Route path="/vote/genre" element={<Genre/>}/>
            <Route path="/vote/timereleased" element={<TimeRating/>}/>
            <Route path="/friends" element={<FriendsPage/>}/>
        </Routes>
    </div>
  );
};

export default App;
