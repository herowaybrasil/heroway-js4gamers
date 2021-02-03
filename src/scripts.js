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
    const { item, top, left } = options;

    const htmlElement = document.createElement("div");
    htmlElement.className = item;
    htmlElement.style.top = `${top}px`;
    htmlElement.style.left = `${left}px`;
    htmlBoardElement.appendChild(htmlElement);
  
    boardElements.push({ item, currentPosition: { top, left } });
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
        conflict?.item !== "forniture"
      );
    }
  
    function validateConflicts(conflict) {
      function finishGame(message) {
        setTimeout(() => {
          alert(message)
          window.location.reload();
        }, 25);
      }

      if (conflict && conflict.item !== "forniture") {
        if (boardElement.item === "hero") {
          if (
            conflict.item === "mini-demon" ||
            conflict.item === "trap"
          ) {
            finishGame("You Died");
          }
  
          if (conflict.item === "chest") {
            finishGame("You Win");
          }
        }
  
        if (boardElement.item === "mini-demon" && conflict.item === "hero") {
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

  function createItem(options) {
    createElement(options);
  }

  function createHero(options) {
    const { top, left } = options;
    const gameElement = createElement({
      item: "hero",
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
      item: "mini-demon",
      top: top,
      left: left,
    });
  
    window.setInterval(() => {
      const directionsValue = Object.values(DIRECTIONS);
      const randomIndex = Math.floor(Math.random() * directionsValue.length);
      const randomDirection = directionsValue[randomIndex];
  
      gameElement.move(randomDirection);
    }, 500);
  }

  return { createItem, createHero, createEnemy };
}

const board = createBoard();

board.createItem({ item: "forniture", top: TILE_SIZE * 2, left: TILE_SIZE * 3 });
board.createItem({ item: "forniture", top: TILE_SIZE * 2, left: TILE_SIZE * 8 });
board.createItem({ item: "forniture", top: TILE_SIZE * 2, left: TILE_SIZE * 16 });
board.createItem({ item: "forniture", top: TILE_SIZE * 17, left: TILE_SIZE * 2 });

// for (let index = 0; index < 10; index++) {
//   const topRandom = Math.floor(Math.random() * 16) + 2;
//   const leftRandom = Math.floor(Math.random() * 16) + 2;
  
//   console.log(`board.createItem({ item: "trap", top: ${TILE_SIZE * topRandom}, left: ${TILE_SIZE * leftRandom} });`);
//   board.createItem({ item: "trap", top: TILE_SIZE * topRandom, left: TILE_SIZE * leftRandom });
// }

// for (let index = 0; index < 20; index++) {
//   const topRandom = Math.floor(Math.random() * 16) + 2;
//   const leftRandom = Math.floor(Math.random() * 16) + 2;
  
//   console.log(`board.createEnemy({ top: ${TILE_SIZE * topRandom}, left: ${TILE_SIZE * leftRandom} });`);
//   board.createEnemy({ top: TILE_SIZE * topRandom, left: TILE_SIZE * leftRandom });
// }

board.createItem({ item: "trap", top: 672, left: 96 });
board.createItem({ item: "trap", top: 768, left: 336 });
board.createItem({ item: "trap", top: 624, left: 528 });
board.createItem({ item: "trap", top: 624, left: 240 });
board.createItem({ item: "trap", top: 288, left: 528 });
board.createItem({ item: "trap", top: 528, left: 816 });
board.createItem({ item: "trap", top: 528, left: 384 });
board.createItem({ item: "trap", top: 672, left: 768 });
board.createItem({ item: "trap", top: 192, left: 768 });
board.createItem({ item: "trap", top: 192, left: 288 });

board.createEnemy({ top: 432, left: 720 });
board.createEnemy({ top: 144, left: 240 });
board.createEnemy({ top: 624, left: 144 });
board.createEnemy({ top: 672, left: 144 });
board.createEnemy({ top: 384, left: 720 });
board.createEnemy({ top: 672, left: 480 });
board.createEnemy({ top: 624, left: 624 });
board.createEnemy({ top: 672, left: 384 });
board.createEnemy({ top: 480, left: 432 });
board.createEnemy({ top: 432, left: 336 });
board.createEnemy({ top: 192, left: 816 });
board.createEnemy({ top: 384, left: 528 });
board.createEnemy({ top: 672, left: 528 });
board.createEnemy({ top: 384, left: 288 });
board.createEnemy({ top: 480, left: 672 });
board.createEnemy({ top: 144, left: 336 });
board.createEnemy({ top: 576, left: 720 });
board.createEnemy({ top: 576, left: 96 });
board.createEnemy({ top: 432, left: 720 });

board.createItem({ item: "chest", top: TILE_SIZE * 2, left: TILE_SIZE * 18 });
board.createHero({ top: TILE_SIZE * 16, left: TILE_SIZE * 2 });
