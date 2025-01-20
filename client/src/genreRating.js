import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";

const genres = {
    "Action": "https://www.themanual.com/wp-content/uploads/sites/9/2021/07/watch-the-tomorrow-war-online.jpeg?resize=1000%2C600&p=1",
    "Adventure": "https://images.squarespace-cdn.com/content/v1/51b3dc8ee4b051b96ceb10de/1627362739909-ROUJ8BLKT5VDOV6PY5C1/review-jungle-cruise-is-super-fun-family-adventure-film.jpg",
    "Animated": "https://m.media-amazon.com/images/S/pv-target-images/3be9512722f03b50aa039fc0d2d71c1bca001b411026c2a554610ffe47ea4071._SX1080_FMjpg_.jpg",
    "Western": "https://upload.wikimedia.org/wikipedia/commons/0/09/Stanley_L._Wood00.jpg",
    "Comedy": "https://as1.ftcdn.net/jpg/01/65/73/36/1000_F_165733664_pAIRjHCQZT2ENCXU44kLv06ATzvZxXfd.jpg",
    "Fantasy": "https://s26162.pcdn.co/wp-content/uploads/2023/09/fantasy-8094384_1280.jpg",
    "Crime": "https://i.cbc.ca/1.4383582.1545938533!/fileImage/httpImage/toronto-police-tape-crime-stoppers.jpg",
    "Drama": "https://www.cellblocklegendz.com/assets/images/woman-gd640eba49_1920.jpg",
    "Horror": "https://greenhouse.hulu.com/app/uploads/sites/11/2023/10/Saw-II-792x469.jpeg",
    "Sci-fi": "https://media.wired.com/photos/592666c1f3e2356fd8009205/master/pass/LifeHP.jpg"
}

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
  margin-top: 7rem;
`;

const GenreContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GenreTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const GenreImage = styled.img`
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const GenreRating = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const name = state?.name;

  const genreKeys = Object.keys(genres);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleVote = async (vote) => {
    const currentGenre = genreKeys[currentIndex];
    const category = "genre";

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
          preference: currentGenre,
          vote,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (currentIndex < genreKeys.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        navigate("/vote/timereleased", { state: { name } });
      }
    } catch (error) {
      console.error("Error updating preferences:", error);
      alert("An error occurred while updating preferences.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!loading) {
        switch (event.key.toLowerCase()) {
          case '1':
            handleVote("like");
            break;
          case '2':
            handleVote("kindaLike");
            break;
          case '3':
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

  const currentGenre = genreKeys[currentIndex];
  const currentImage = genres[currentGenre];

  return (
    <Container>
      <ProgressBar>
        <Step active={true}>1</Step>
        <Edge active={true} />
        <Step active={true}>2</Step>
        <Edge active={false} />
        <Step active={false}>3</Step>
      </ProgressBar>
      <Title>Vote for a Genre</Title>
      <GenreContainer>
        <GenreTitle>{currentGenre}</GenreTitle>
        <GenreImage src={currentImage} alt={currentGenre} />
        <ButtonContainer>
          <StyledButton onClick={() => handleVote("like")} disabled={loading} color="linear-gradient(to bottom right, #4CAF50, #45a049)">
            Like
          </StyledButton>
          <StyledButton onClick={() => handleVote("kindaLike")} disabled={loading} color="linear-gradient(to bottom right, #FFC107, #FFB300)">
            Kinda Like
          </StyledButton>
          <StyledButton onClick={() => handleVote("dislike")} disabled={loading} color="linear-gradient(to bottom right, #F44336, #D32F2F)">
            Dislike
          </StyledButton>
        </ButtonContainer>
      </GenreContainer>
    </Container>
  );
};

export default GenreRating;
