import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";

const periods = {
  "Pre 1970": "https://www.rd.com/wp-content/uploads/2022/08/30-Classic-Movies-That-Are-Truly-Timeless-FT.jpg?fit=700%2C467",
  "1970s": "https://www.rollingstone.com/wp-content/uploads/2023/04/WEB_70s.jpg?w=1581&h=1054&crop=1",
  "1980s": "https://hips.hearstapps.com/hmg-prod/images/80-movies-1570826605.png?crop=0.6666666666666666xw:1xh;center,top&resize=1200:*",
  "1990s": "https://www.rollingstone.com/wp-content/uploads/2018/06/rs_greatest90smovies-6eadb90c-6b8f-416d-8ac4-65fe32c5e1e2.jpg?w=910&h=511&crop=1",
  "2000s": "https://cdn.prod.website-files.com/5af9ea171bc1894fa51a3fa2/5fd3b7bc5180366d4667ea14_BeFunky-collage%20(3).jpg",
  "2010s": "https://miro.medium.com/v2/resize:fit:1068/1*gUTjatorYSrbs9eoUCXAxQ.png",
  "2020s": "https://preview.redd.it/my-top-20-films-of-the-2020s-so-far-v0-g7ugudo95ovb1.jpg?width=1080&crop=smart&auto=webp&s=35cafd4209e424007282d2c07746696a03e743de"
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

const PeriodContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PeriodTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const PeriodImage = styled.img`
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

const PeriodRating = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const name = state?.name;

  const periodKeys = Object.keys(periods);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleVote = async (vote) => {
    const currentPeriod = periodKeys[currentIndex];
    const category = "timeReleased";

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
          preference: currentPeriod,
          vote,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (currentIndex < periodKeys.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        navigate("/friends");
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

  const currentPeriod = periodKeys[currentIndex];
  const currentImage = periods[currentPeriod];

  return (
    <Container>
      <ProgressBar>
        <Step active={true}>1</Step>
        <Edge active={true} />
        <Step active={true}>2</Step>
        <Edge active={true} />
        <Step active={true}>3</Step>
      </ProgressBar>
      <Title>Vote for a Period</Title>
      <PeriodContainer>
        <PeriodTitle>{currentPeriod}</PeriodTitle>
        <PeriodImage src={currentImage} alt={currentPeriod} />
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
      </PeriodContainer>
    </Container>
  );
};

export default PeriodRating;
