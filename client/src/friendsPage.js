import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Fade, Zoom } from "react-awesome-reveal";
import ReactCanvasConfetti from "react-canvas-confetti";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: black;
  color: white;
  text-align: center;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
`;

const FriendsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-bottom: 2rem;
`;

const FriendItem = styled.li`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StyledButton = styled.button`
  background: linear-gradient(to bottom right, #ff69b4, #ff1493);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(to bottom right, #ff1493, #ff69b4);
  }
`;

const MovieRecommendation = styled.div`
  font-size: 1.8rem;
  margin-top: 2rem;
  padding: 1rem;
  background: linear-gradient(to bottom right, #4b0082, #8a2be2);
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const MovieTitle = styled.span`
  font-weight: bold;
  color: #ffd700;
`;

const canvasStyles = {
  position: "fixed",
  pointerEvents: "none",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0
};

const FriendsPage = () => {
  const [friends, setFriends] = useState([]);
  const [movieRecommendation, setMovieRecommendation] = useState("");
  const navigate = useNavigate();
  const [isExploding, setIsExploding] = useState(false);

  const goBack = () => {
    navigate("/");
  };

  useEffect(() => {
    fetch("http://localhost:3001/friends")
      .then((res) => res.json())
      .then((data) => setFriends(data.friends));
  }, []);

  const handleRecommendMovie = async () => {
    const friendsData = friends.map((friend) => friend.preferences);
    const response = await fetch("http://localhost:3001/recommendation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(friendsData),
    });

    const data = await response.json();
    setMovieRecommendation(data.movieRecommendation.content);
    setIsExploding(true);
    setTimeout(() => setIsExploding(false), 3000);
  };

  const getAnimationSettings = (originXA, originXB) => {
    return {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0,
      particleCount: 150,
      origin: {
        x: randomInRange(originXA, originXB),
        y: Math.random() - 0.2
      }
    };
  };

  const randomInRange = (min, max) => {
    return Math.random() * (max - min) + min;
  };

  return (
    <Container>
      <Fade>
        <Title>Friends that have already voted</Title>
        <FriendsList>
          {friends.map((friend) => (
            <FriendItem key={friend._id}>{friend.name}</FriendItem>
          ))}
        </FriendsList>
        <ButtonContainer>
          <StyledButton onClick={handleRecommendMovie}>Reveal Movie</StyledButton>
          <StyledButton onClick={goBack}>Add New Friend</StyledButton>
        </ButtonContainer>
      </Fade>
      {movieRecommendation && (
        <Zoom>
          <MovieRecommendation>
            <MovieTitle>{movieRecommendation}</MovieTitle>
          </MovieRecommendation>
        </Zoom>
      )}
      <ReactCanvasConfetti
        style={canvasStyles}
        fire={isExploding}
        particleCount={300}
        spread={360}
        origin={{ x: 0.5, y: 0.5 }}
      />
    </Container>
  );
};

export default FriendsPage;
