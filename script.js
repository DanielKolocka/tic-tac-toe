
function gameBoard() {
    const rows = 3;
    const columns = 3;
    let board = [];

    // [1], [2], [3]       [[[], [], []], [[], [], []], [[], [], []]]
    // [4], [5], [6]
    // [7], [8], [9]

    for (let i = 0; i<rows; i++) {
        board[i] = [];
        for (let k = 0; k<columns; k++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const placeToken = (gridSpot, player) => {
        const row = Math.floor(gridSpot/rows);
        let column = gridSpot % columns;

        console.log("Row: " + row);
        console.log("Column: " + column);

        // This flag is to determine if the turn was played. If spot already taken, player should play again
        // let playedTurn = false;

        // while (!playedTurn) {
            if (board[row][column].getValue() != 0) {
                // Can't play this turn. Spot already taken
                console.log("Spot already taken");
                return false;
            }
            // test this
            else {
                board[row][column].addToken(player);
                console.log(player.getPlayer().name + " played token at: " + row + "|" + column);
                // playedTurn = true;
                return true;
            // }
        }
    }
// [[], [], []], [[], [], []]
    const printBoard = () => {
        console.log("Printing board:");
        let tempBoard = board.map(row => row.map(cell => cell.getValue()));
        console.log(tempBoard);
    }

    return {getBoard, placeToken, printBoard};
}

/*
  ** A Cell represents one "square" on the board and can have one of
  ** 0: no token is in the square,
  ** 1: Player One's token,
  ** 2: Player 2's token
  */
function Cell() {

    let value = 0;

    // Accept a player's token to change the value of the cell
    const addToken = (player) => {
        value = player.getPlayer().token;
    }

    const getValue = () => {
        return value;
    }

    return {addToken, getValue}
}


 /* 
  ** The GameController will be responsible for controlling the 
  ** flow and state of the game's turns, as well as whether
  ** anybody has won the game
  */
  function GameController() {
    const board = gameBoard();

    const players = [
       Player("Daniel", "x"),
       Player("Monika", "y")
    ];

    let activePlayer = players[0];

    // Switch the active player
    const switchActivePlayer = () => {
        activePlayer = (activePlayer == players[0]) ? players[1] : players[0];
        console.log("Switching player to: " + activePlayer.getPlayer().name);
    }

// Play a turn for the active user
    const playTurn = (gridSpot) => {
        if (board.placeToken(gridSpot, activePlayer)) {
            switchActivePlayer();
        }
        
    }

    const showRound = () => {
        board.printBoard();
    }

    return {playTurn, showRound};

  }

  function Player (playerName, playerToken) {

    const name = playerName;
    const token = playerToken;

    const getPlayer = () => {
        return {name, token}
    }

    return {getPlayer}

  }
