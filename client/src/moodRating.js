import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";

const moods = {
  Dark: "https://www.photoaspects.com/wp-content/uploads/2020/03/Depositphotos_62819669_xl-2015-1152x759.jpg",
  Sad: "https://www.shutterstock.com/shutterstock/videos/1022303233/thumb/10.jpg?ip=x480",
  Happy: "https://www.theladders.com/wp-content/uploads/friends-happy-190821.jpg",
  Romantic: "https://smartloving.org/wp-content/uploads/2021/08/Romantic-Love-1024x400.png",
  Nostalgic: "https://bostonglobe-prod.cdn.arcpublishing.com/resizer/v2/HAGRPQVFEVGABJTT4JGPPRVO5U.jpg?auth=57745677786125835abe5a9e9001ecbc484eb7740c4c60b3cd9bb02303cc8884&width=1440",
  Inspiring: "https://personalityjunkie.com/wp-content/uploads/2021/08/inspiration-min.jpg",
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  min-height: 100vh;
  background-color: black;
  color: white;
  text-align: center;
  padding-top: 2rem;
`;

const ProgressBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  max-width: 400px;
  margin-bottom: 2rem;
`;

const Step = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.active ? 'linear-gradient(to bottom right, #ff69b4, #ff1493)' : '#333'};
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: white;
  position: relative;
  z-index: 2;
`;

const Edge = styled.div`
  flex-grow: 1;
  height: 3px;
  background: ${props => props.active ? 'linear-gradient(to right, #ff69b4, #ff1493)' : '#333'};
  margin: 0 -20px;
  z-index: 1;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  margin-top: 7rem
`;

const MoodContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MoodTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const MoodImage = styled.img`
  max-width: 80%;
  max-height: 50vh;
  object-fit: cover;
  margin-bottom: 2rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const StyledButton = styled.button`
  background: ${props => props.color};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    filter: brightness(1.2);
  }
`;

const MoodRating = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const name = state?.name;

  const moodKeys = Object.keys(moods);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleVote = async (vote) => {
    const currentMood = moodKeys[currentIndex];
    const category = "mood";

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/update-preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          category,
          preference: currentMood,
          vote,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (currentIndex < moodKeys.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        navigate("/vote/genre", { state: { name } });
      }
    } catch (error) {
      console.error("Error updating preferences:", error);
      alert("An error occurred while updating preferences. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!loading) {
        switch (event.key.toLowerCase()) {
          case 'a':
            handleVote("like");
            break;
          case 's':
            handleVote("kindaLike");
            break;
          case 'd':
            handleVote("dislike");
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [loading, currentIndex]);

  const currentMood = moodKeys[currentIndex];
  const currentImage = moods[currentMood];

  return (
    <Container>
      <ProgressBar>
        <Step active={true}>1</Step>
        <Edge active={false} />
        <Step active={false}>2</Step>
        <Edge active={false} />
        <Step active={false}>3</Step>
      </ProgressBar>
      <Title>What's the mood for today?</Title>
      <MoodContainer>
        <MoodTitle>{currentMood}</MoodTitle>
        <MoodImage src={currentImage} alt={currentMood} />
        <ButtonContainer>
          <StyledButton onClick={() => handleVote("like")} color="linear-gradient(to bottom right, #4CAF50, #45a049)">
            Like
          </StyledButton>
          <StyledButton onClick={() => handleVote("kindaLike")} color="linear-gradient(to bottom right, #FFC107, #FFB300)">
            Kinda Like
          </StyledButton>
          <StyledButton onClick={() => handleVote("dislike")} color="linear-gradient(to bottom right, #F44336, #D32F2F)">
            Dislike
          </StyledButton>
        </ButtonContainer>
      </MoodContainer>
    </Container>
  );
};

export default MoodRating;