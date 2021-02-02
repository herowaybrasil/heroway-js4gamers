const TILE_SIZE = 48;
const HELMET_OFFSET = 12;
const GAME_SIZE = TILE_SIZE * 20;

const DIRECTIONS = {
  up: "ArrowUp",
  right: "ArrowRight",
  down: "ArrowDown",
  left: "ArrowLeft",
};

const root = document.documentElement;
root.style.setProperty("--tile-size", `${TILE_SIZE}px`);
root.style.setProperty("--helmet-offset", `${HELMET_OFFSET}px`);
root.style.setProperty("--game-size", `${GAME_SIZE}px`);

// -----

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

const allElements = [];
function createGameElement(options) {
  const { className, top, left } = options;

  allElements.push({
    className,
    currentPosition: { top, left },
  });
  const element = allElements[allElements.length - 1];

  const htmlElement = document.createElement("div");
  htmlElement.className = className;
  htmlElement.style.top = `${top}px`;
  htmlElement.style.left = `${left}px`;

  function validateMoviment(position, conflict) {
    return (
      position.left >= 48 &&
      position.left <= 864 &&
      position.top >= 96 &&
      position.top <= 816 &&
      conflict?.className !== "forniture"
    );
  }

  function getMovimentConflict(position) {
    return allElements.find((el) => {
      return (
        el.currentPosition.top === position.top &&
        el.currentPosition.left === position.left
      );
    });
  }

  function validateConflicts(conflict) {
    if (conflict && conflict.className !== "forniture") {
      if (element.className === "hero") {
        if (
          conflict.className === "mini-demon" ||
          conflict.className === "trap"
        ) {
          setTimeout(() => alert("You Died"), 10);
        }

        if (conflict.className === "chest") {
          setTimeout(() => alert("You Win"), 10);
        }
      }

      if (element.className === "mini-demon" && conflict.className === "hero") {
        setTimeout(() => alert("You Died"), 10);
      }
    }
  }

  function move(buttonPressed) {
    const newPosition = getNewPosition(buttonPressed, element.currentPosition);
    const conflict = getMovimentConflict(newPosition);
    const isValidMoviment = validateMoviment(newPosition, conflict);

    if (isValidMoviment) {
      validateConflicts(conflict);

      element.currentPosition = newPosition;
      htmlElement.style.top = `${newPosition.top}px`;
      htmlElement.style.left = `${newPosition.left}px`;
    }
  }

  appendToBoard(htmlElement);

  return { element: htmlElement, move };
}

function createGameHero(options) {
  const { top, left } = options;
  const gameElement = createGameElement({
    className: "hero",
    top: top,
    left: left,
  });

  window.addEventListener("keydown", (event) => {
    gameElement.move(event.key);
  });
}

function createGameEnemy(options) {
  const { top, left } = options;
  const gameElement = createGameElement({
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

function appendToBoard(child) {
  const boardElement = document.getElementById("board");
  boardElement.appendChild(child);
}

createGameHero({ top: TILE_SIZE * 16, left: TILE_SIZE * 2 });
createGameEnemy({ top: TILE_SIZE * 4, left: TILE_SIZE * 2 });

createGameElement({ className: "forniture", top: TILE_SIZE * 2, left: TILE_SIZE * 3 });
createGameElement({ className: "forniture", top: TILE_SIZE * 2, left: TILE_SIZE * 8 });
createGameElement({ className: "forniture", top: TILE_SIZE * 2, left: TILE_SIZE * 16 });
createGameElement({ className: "forniture", top: TILE_SIZE * 17, left: TILE_SIZE * 2 });

createGameElement({ className: "trap", top: TILE_SIZE * 6, left: TILE_SIZE * 2 });
createGameElement({ className: "chest", top: TILE_SIZE * 8, left: TILE_SIZE * 2 });
