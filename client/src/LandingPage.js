import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if name already exists in db
    const checkResponse = await fetch(`http://localhost:3001/namecheck/${name}`);
    const checkData = await checkResponse.json();

    if (checkData.exists) {
      alert("This person has already chosen their preferences.");
      return;
    }

    // Create new friend into the database
    const response = await fetch("http://localhost:3001/create-friend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        preferences: { mood: {}, genre: {}, timeReleased: {}, length: {} },
      }),
    });

    if (response.ok) {
      navigate("/vote/mood", { state: { name } });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-black text-white">
      <img src="/logo.png" alt="Logo" className="w-32 mb-10" />

      <div className="flex flex-col justify-center items-center bg-black w-full max-w-3xl p-6 rounded-lg">
        <h1 className="text-5xl text-center mb-14 w-full">
          End the endless debates: Let us pick your next movie!
        </h1>

        <h2 className="text-lg text-center mt-12">Start your journey to the perfect movie pick!</h2>
        <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-sm">
          <input
            className="w-full bg-transparent mt-20 placeholder:text-pink-400 text-white text-sm text-center border border-pink-200 rounded-md px-8 py-3 mx-auto transition duration-300 ease focus:outline-none focus:border-pink-500 hover:border-pink-400 shadow-sm focus:shadow mb-6"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button
            type="submit"
            className="w-full text-white mt-4 bg-gradient-to-br from-pink-500 to-pink-500 hover:bg-gradient-to-tr focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-600 font-medium rounded-md text-sm px-8 py-3 text-center transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:from-pink-600 hover:to-pink-400"
          >
            Start choosing
          </button>
        </form>
      </div>
    </div>
  );
};

export default LandingPage;
