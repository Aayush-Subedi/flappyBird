import "./App.css"; // imports the App.css file
import styled from "styled-components"; // imports the styled-components library
import { useEffect, useState } from "react"; // imports the useEffect and useState hooks from the react library

const BIRD_SIZE = 20; // sets the size of the bird
const GAME_WIDTH = 500; // sets the width of the game
const GAME_HEIGHT = 500; // sets the height of the game
const GRAVITY = 6; // sets the gravity for the bird
const JUMP_HEIGHT = 100; // sets the jump height for the bird
const OBSTACLE_WIDTH = 40; // sets the width of the obstacles
const OBSTACLE_GAP = 200; // sets the gap between the top and bottom obstacles

function App() {
  const [birdPosition, setBirdPosition] = useState(250); // sets the initial position of the bird
  const [gameHasStarted, setGameHasStarted] = useState(false); // sets the initial state of the game
  const [obstacleHeight, setObstacleHeight] = useState(200); // sets the initial height of the obstacles
  const [obstacleLeft, setObstacleLeft] = useState(GAME_WIDTH - OBSTACLE_WIDTH); // sets the initial position of the obstacles
  const [score, setScore] = useState(0); // sets the initial score to 0

  const bottomObstacleHeight = GAME_HEIGHT - OBSTACLE_GAP - obstacleHeight; // calculates the height of the bottom obstacle

  useEffect(() => {
    let timeId;
    if (gameHasStarted && birdPosition < GAME_HEIGHT - BIRD_SIZE)
      // if the game has started and the bird is still within the game height
      timeId = setInterval(() => {
        setBirdPosition((birdPosition) => birdPosition + GRAVITY); // updates the bird's position based on gravity
      }, 24);

    return () => {
      clearInterval(timeId); // clears the interval when the component is unmounted
    };
  }, [birdPosition, gameHasStarted]);

  useEffect(() => {
    let obstacleId;
    if (gameHasStarted && obstacleLeft >= -OBSTACLE_WIDTH) {
      // if the game has started and the obstacle is still within the game width
      obstacleId = setInterval(() => {
        setObstacleLeft((obstacleLeft) => obstacleLeft - 5); // moves the obstacle to the left by 5px
      }, 24);

      return () => {
        clearInterval(obstacleId); // clears the interval when the component is unmounted
      };
    } else {
      setObstacleLeft(GAME_WIDTH - OBSTACLE_WIDTH); // resets the obstacle's position
      setObstacleHeight(
        Math.floor(Math.random() * (GAME_HEIGHT - OBSTACLE_GAP)) // generates a random height for the obstacle
      );
      setScore((score) => score + 1); // increments the score
    }
  }, [gameHasStarted, obstacleLeft]);

  useEffect(() => {
    const hasCollidedWithTopObstacle =
      birdPosition >= 0 && birdPosition < obstacleHeight; // checks if the bird has collided with the top obstacle
    const hasCollidedWithBottomObstacle =
      birdPosition <= 500 && birdPosition >= 500 - bottomObstacleHeight; // checks if the bird has collided with the bottom obstacle
    if (
      obstacleLeft >= 0 &&
      obstacleLeft <= OBSTACLE_WIDTH &&
      (hasCollidedWithTopObstacle || hasCollidedWithBottomObstacle)
    ) {
      setGameHasStarted(false); // ends the game if the bird has collided with an obstacle
    }
  }, [birdPosition, obstacleHeight, bottomObstacleHeight, obstacleLeft]);

  const handleClick = () => {
    let newBirdPosition = birdPosition - JUMP_HEIGHT; // calculates the new position of the bird after a jump
    if (!gameHasStarted) {
      setGameHasStarted(true);
      setScore(0);
    }
    if (newBirdPosition < 0) {
      // prevents the bird from going above the game height
      setBirdPosition(0);
    } else {
      setBirdPosition(newBirdPosition);
    }
  };

  return (
    <Div onClick={handleClick}>
      <GameBox height={GAME_HEIGHT} width={GAME_WIDTH}>
        <Obstacle
          top={0}
          width={OBSTACLE_WIDTH}
          height={obstacleHeight}
          left={obstacleLeft}
        />
        <Obstacle
          top={GAME_HEIGHT - (obstacleHeight + bottomObstacleHeight)}
          width={OBSTACLE_WIDTH}
          height={bottomObstacleHeight}
          left={obstacleLeft}
        />
        <Bird size={BIRD_SIZE} top={birdPosition} />
      </GameBox>
      <span> {score} </span>
    </Div>
  );
}

export default App;




// styled-components

const Bird = styled.div`
  position: absolute;
  background-color: red;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  top: ${(props) => props.top}px;
  border-radius: 50%;
`;

const Div = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  & span {
    color: white;
    font-size: 24px;
    position: absolute;
  }
`;

const GameBox = styled.div`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  background-color: blue;
  overflow: hidden;
`;

const Obstacle = styled.div`
  position: relative;
  top: ${(props) => props.top}px;
  background-color: green;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  left: ${(props) => props.left}px;
`;
