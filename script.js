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
    return false
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

  const isBoardFull = () => {
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < column; j++) {
        if (board[i][j].getValue() === " ") return false;
      }
    }
    return true;
  }

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
    return false
  }

  return {
    getBoard,
    fillCell,
    printBoard,
    isBoardFull,
    isCellFull,
    isWinner,
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
  playerOne = "Player One",
  playerTwo = "Player Two"
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

  let activePlayer = players[0];

  const getActivePlayer = () => {
    activePlayer = (activePlayer === players[0]) ? players[1] : players[0];
  }

  const printNewRound = (...coords) => {
    board.printBoard();
    console.log(`${activePlayer.name} has chose to put ${activePlayer.value} on row ${coords[0]} column ${coords[1]}`);
  }

  const getGameStatus = () => gameover;

  const changeGameStatus = () => {
    gameover = true;
  }

  const printWinner = () => {
    console.log(`${activePlayer.name} has won the game!!`)
  }

  const playRound = () => {
    
    const playerCoords = prompt("Where would you like to play? (row col)").split(" ").map(str => Number(str));
    
    // Fill cell and if already fill recall the func
    if (board.fillCell(activePlayer.value, ...playerCoords)) {
      console.log("Incorrect input")
      changeGameStatus();
    }
    
    
    if (board.isCellFull(...playerCoords)) {
      if (board.isBoardFull()) {
        changeGameStatus();
      }
    }

    if (!gameover) {
      printNewRound(...playerCoords);
    }

    // Check if there's a winner
    if (board.isWinner(activePlayer.value)) {
      printWinner();
      changeGameStatus();
    }
    
    getActivePlayer();
  }

  return {
    playRound,
    getGameStatus
  }
}

const game = GameController();
while(!game.getGameStatus()) {
  game.playRound();
}
