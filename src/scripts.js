const TILE_SIZE = 48;
const HELMET_OFFSET = 12;
const GAME_SIZE = TILE_SIZE * 20;

const DIRECTIONS = {
  up: "ArrowUp",
  right: "ArrowRight",
  down: "ArrowDown",
  left: "ArrowLeft",
};

// -----

const root = document.documentElement;
root.style.setProperty("--tile-size", `${TILE_SIZE}px`);
root.style.setProperty("--helmet-offset", `${HELMET_OFFSET}px`);
root.style.setProperty("--game-size", `${GAME_SIZE}px`);

// -----

function createBoard() {
  const htmlBoardElement = document.getElementById("board");
  const boardElements = [];

  function createElement(options) {
    const { className, top, left } = options;

    const htmlElement = document.createElement("div");
    htmlElement.className = className;
    htmlElement.style.top = `${top}px`;
    htmlElement.style.left = `${left}px`;
    htmlBoardElement.appendChild(htmlElement);
  
    boardElements.push({ className, currentPosition: { top, left } });
    const boardElement = boardElements[boardElements.length - 1];

    function getNewPosition(buttonPressed, position) {
      switch (buttonPressed) {
        case DIRECTIONS.up:
          return { left: position.left, top: position.top - TILE_SIZE };
    
        case DIRECTIONS.right:
          return { left: position.left + TILE_SIZE, top: position.top };
    
        case DIRECTIONS.down:
          return { left: position.left, top: position.top + TILE_SIZE };
    
        case DIRECTIONS.left:
          return { left: position.left - TILE_SIZE, top: position.top };
    
        default:
          position;
      }
    }

    function getMovimentConflict(position) {
      return boardElements.find((el) => {
        return (
          el.currentPosition.top === position.top &&
          el.currentPosition.left === position.left
        );
      });
    }
  
    function validateMoviment(position, conflict) {
      return (
        position.left >= 48 &&
        position.left <= 864 &&
        position.top >= 96 &&
        position.top <= 816 &&
        conflict?.className !== "forniture"
      );
    }
  
    function validateConflicts(conflict) {
      function finishGame(message) {
        setTimeout(() => {
          alert(message)
          window.location.reload();
        }, 25);
      }

      if (conflict && conflict.className !== "forniture") {
        if (boardElement.className === "hero") {
          if (
            conflict.className === "mini-demon" ||
            conflict.className === "trap"
          ) {
            finishGame("You Died");
          }
  
          if (conflict.className === "chest") {
            finishGame("You Win");
          }
        }
  
        if (boardElement.className === "mini-demon" && conflict.className === "hero") {
          finishGame("You Died");
        }
      }
    }
  
    function move(buttonPressed) {
      const newPosition = getNewPosition(buttonPressed, boardElement.currentPosition);
      const conflict = getMovimentConflict(newPosition);
      const isValidMoviment = validateMoviment(newPosition, conflict);
  
      if (isValidMoviment) {
        validateConflicts(conflict);
  
        boardElement.currentPosition = newPosition;
        htmlElement.style.top = `${newPosition.top}px`;
        htmlElement.style.left = `${newPosition.left}px`;
      }
    }
  
    return { move };
  }

  function createHero(options) {
    const { top, left } = options;
    const gameElement = createElement({
      className: "hero",
      top: top,
      left: left,
    });
  
    window.addEventListener("keydown", (event) => {
      gameElement.move(event.key);
    });
  }

  function createEnemy(options) {
    const { top, left } = options;
    const gameElement = createElement({
      className: "mini-demon",
      top: top,
      left: left,
    });
  
    window.setInterval(() => {
      const directionsValue = Object.values(DIRECTIONS);
      const randomIndex = Math.floor(Math.random() * directionsValue.length);
      const randomDirection = directionsValue[randomIndex];
  
      gameElement.move(randomDirection);
    }, 2000);
  }

  return { createElement, createHero, createEnemy };
}

const board = createBoard();

board.createElement({ className: "forniture", top: TILE_SIZE * 2, left: TILE_SIZE * 3 });
board.createElement({ className: "forniture", top: TILE_SIZE * 2, left: TILE_SIZE * 8 });
board.createElement({ className: "forniture", top: TILE_SIZE * 2, left: TILE_SIZE * 16 });
board.createElement({ className: "forniture", top: TILE_SIZE * 17, left: TILE_SIZE * 2 });

board.createElement({ className: "trap", top: TILE_SIZE * 6, left: TILE_SIZE * 2 });
board.createElement({ className: "chest", top: TILE_SIZE * 8, left: TILE_SIZE * 2 });

board.createHero({ top: TILE_SIZE * 16, left: TILE_SIZE * 2 });
board.createEnemy({ top: TILE_SIZE * 4, left: TILE_SIZE * 2 });
