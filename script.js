
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
        const row = Math.round(gridSpot/rows);
        let column;
        // let col = (gridSpot % columns === 0) ? 3 : (gridSpot % columns === 1) ? 1 : 2;
        switch(gridSpot % columns) {
            case 0:
                column = 3;
            case 1:
                column = 1;
            case 2:
                column = 2;
        }
        console.log("Column: " + column);
        console.log("Row: " + row);
        if (board[row][column].getValue() != 0) {
            // Can't play this turn. Spot already taken
            console.log("Spot already taken");
        }
        else {
            // board[row][column].addToken(player);
            console.log(player.name + "played token at: " + row + "|" + column);
        }
    }

    return {getBoard, placeToken};
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
    // console.log(activePlayer.getPlayer());
    // console.log(players);
    // console.log(players[0]);

    // Switch the active player
    const switchActivePlayer = () => {
        activePlayer = players[0] ? players[1] : players[0];
    }

// Play a turn for the active user
    const playTurn = (gridSpot) => {
        board.placeToken(gridSpot, activePlayer.getPlayer());
        switchActivePlayer();
    }

    return {playTurn};

  }

  function Player (playerName, playerToken) {

    const name = playerName;
    const token = playerToken;

    const getPlayer = () => {
        return {name, token}
    }

    return {getPlayer}

  }
