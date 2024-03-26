let gameboardDiv = document.querySelector(".gameboard");

/** 
 * Function that's responsible for all board properties
 * and functions
 */
function Gameboard() {
  const row = 3;
  const column = 3;
  let board = [];

  // Create the game board
  for (let i = 0; i < row; i++) {
    board[i] = [];
    for (let j = 0; j < column; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  // Function to fill the selected player's cell
  const fillCell = (player, ...coords) => {
    if (board[coords[0]][coords[1]].getValue() !== " ") return true;

    board[coords[0]][coords[1]].changeValue(player);
    return false;
  };

  const isCellFull = (...coords) => {
    if (board[coords[0]][coords[1]].getValue() !== " ") {
      return true;
    }
    return false;
  }

  // Prints board to the console
  const printBoard = () => {
    let boardContent = "";
    for (let i = 0; i < row; i++) {
      let rowSeparator = "";
      boardContent += "|";
      rowSeparator += "-"
        for (let j = 0; j < row; j++) {
          boardContent += board[i][j].getValue()
          boardContent += "|";
          rowSeparator += "--"
      }
      boardContent += "\n";
      boardContent += rowSeparator + "\n";
    }
    console.log(boardContent);
  }

  // Fills the board with cells that have unique ids
  const fillBoard = (func) => {
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < column; j++) {
        const cell = document.createElement("button");
        cell.setAttribute("id", `${i}${j}`);

        cell.addEventListener("click", () => {
          let coords = cell.getAttribute("id").split("").map((str) => Number(str))
          cell.textContent = func(coords);
          cell.disabled = true;
        });

        gameboardDiv.appendChild(cell);
      }
    }
  }

  // Checks if the board is full
  const isBoardFull = () => {
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < column; j++) {
        if (board[i][j].getValue() === " ") return false;
      }
    }
    return true;
  }

  // Checks if the current player's value has won
  const isWinner = (value) => {
    // Horizontal & Vertical check
    for (let i = 0; i < row; i++) {
      let rowValues = "";
      let colValues = "";
      for (let j = 0; j < column; j++) {
        rowValues += board[i][j].getValue();
        colValues += board[j][i].getValue();
      }
      if (rowValues === value.repeat(row)) return true;
      if (colValues === value.repeat(column)) return true;
    }

    // Diagonal check left
    let diagonalValues = "";
    for (let i = 0; i < row; i++) {
      diagonalValues += board[i][i].getValue();
    }
    if (diagonalValues === value.repeat(row)) return true;
    
    // Diagonal check right
    diagonalValues = "";
    for (let i = 0; i < row; i++) {
      diagonalValues += board[i][row - i - 1].getValue();
    }
    if (diagonalValues === value.repeat(row)) return true;
    
    return false
  }

  return {
    getBoard,
    fillCell,
    printBoard,
    isBoardFull,
    isCellFull,
    isWinner,
    fillBoard
  }
}

/**
 * Function that represent each cell in the board
 */
function Cell() {
  let value = " ";

  // Change the value of the current cell depending on the player's value
  const changeValue = (player) => {
    value = player;
  };

  // Function that utilizes the closure and returns the cell's value
  const getValue = () => value;

  return {
    changeValue,
    getValue
  }
}

/**
 * Class to control the flow state of the game.
 * whose player's turn and check who won the game
 */
function GameController(
  playerOne = "player1",
  playerTwo = "player2"
) {
  // Inheriting all the functions and properties from the Gameboard factory function
  const board = Gameboard();
  let gameover = false;
  
  const players = [{
    name: playerOne,
    value: "X"
  }, {
    name: playerTwo,
    value: "O"
  }];

  let activePlayer = players[1];

  const getActivePlayer = () => {
    activePlayer = (activePlayer === players[0]) ? players[1] : players[0];
  }

  // Returns the game status
  const getGameStatus = () => gameover;

  // Changes game status
  const changeGameStatus = () => {
    gameover = true;
  }
  
  // Prints winner and changes score
  const printWinner = () => {
    alert(`${activePlayer.name} has won the game!!`)
    changeScore(activePlayer.name);
  }

  // Changes the score
  changeScore = (name) => {
    let scoreDiv = document.querySelector(`.${name}-score`);
    const currScore = scoreDiv.children[1].textContent;
    scoreDiv.children[1].textContent = +currScore + 1;
  }

  const playRound = (playerCoords) => {
    getActivePlayer();
    
    board.fillCell(activePlayer.value, ...playerCoords);
    
    // Check if there's a winner
    if (board.isWinner(activePlayer.value)) {
      printWinner();
      changeGameStatus();
    }
    
    // Check if the board is full
    if (board.isCellFull(...playerCoords)) {
      if (board.isBoardFull()) {
        alert("it's a tie");
        changeScore("draw");
        changeGameStatus();
      }
    }

    return activePlayer.value;
  }

  board.fillBoard(playRound);

  return {
    playRound,
    getGameStatus
  }
}

let game = GameController()