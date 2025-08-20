
function gameBoard() {
    const rows = 3;
    const columns = 3;
    let board = [];

    // [1], [2], [3]       [[[], [], []], [[], [], []], [[], [], []]]
    // [4], [5], [6]
    // [7], [8], [9]

    const initializeBoard = () => {
        for (let i = 0; i<rows; i++) {
            board[i] = [];
            for (let k = 0; k<columns; k++) {
                board[i].push(Cell());
            }
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
            else {
                board[row][column].addToken(player);
                console.log(player.getPlayer().name + " played token at: " + row + "|" + column);
                console.log(board[row][column]);
                console.log(board[row][column].getValue());
                // playedTurn = true;
                return true;
            // }
        }
    }

    const printBoard = () => {
        console.log("Printing board:");
        let tempBoard = board.map(row => row.map(cell => cell.getValue()));
        console.log(tempBoard);
    }

    const restartBoard = () => {
        board.splice(0, board.length);
        console.log(board);
    }

    initializeBoard();

    return {getBoard, placeToken, printBoard, restartBoard, initializeBoard};
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
        console.log("Value added is: " + value);
        return;
    }

    const getValue = () => {
        // console.log("Get value: " + value);
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
    let isWin = false;

    const players = [
        Player("Daniel", "x"),
        Player("Monika", "y")
    ];

    let activePlayer = players[0];
    let count = 0;

    // Switch the active player
    const switchActivePlayer = () => {
        activePlayer = (activePlayer == players[0]) ? players[1] : players[0];
        console.log("Switching player to: " + activePlayer.getPlayer().name);
    }

    // Play a turn for the active user
    const playTurn = (gridSpot) => {
        //  If a move was played
        if (board.placeToken(gridSpot, activePlayer)) {
            count++;
            if (count >= 9) {
                console.log("It's a tie!");
            }
            
            if (!isWinningMove()) {
                // console.log("Play Turn log winner actually!");
                console.log("not winning move!");
                switchActivePlayer();
            }
            else {
                if (isWinningMove().getValue() == 'x' || isWinningMove().getValue() == 'y') {
                    announceWinner(activePlayer);
                }
                else {
                    console.log("not winning move!");
                    switchActivePlayer();
                }
            }
        }
    }

    const showRound = () => {
        board.printBoard();
    }

    const isWinningMove = () => {
        let game = board.getBoard();
        // Check horizonat and vertical win
        for (let i=0; i<3; i++) {
            if ((game[i][0].getValue() == game[i][1].getValue()) && (game[i][0].getValue() == game[i][2].getValue())) {
                // announceWinner(activePlayer);
                // console.log("Winner scenario 1");
                return game[i][0];
            }
            else if ((game[0][i].getValue() == game[1][i].getValue()) && (game[0][i].getValue() == game[2][i].getValue())) {
                // announceWinner(activePlayer);
                // console.log("Winner scenario 2");
                return game[0][i];
            }
        }
        // Check diaganol win
        if (((game[0][0].getValue() == game[1][1].getValue()) && (game[0][0].getValue() == game[2][2].getValue())) || ((game[2][0].getValue() == game[1][1].getValue()) && (game[2][0].getValue() == game[0][2].getValue()))) {
            // announceWinner(activePlayer);
            // console.log("Winner scenario 3");
            return game[0][0];
        }
        console.log("No winner yet!");
        return false;
    }

    const announceWinner = (winningPlayer) => {
        console.log(winningPlayer.getPlayer().name + " has won!");
    }

    const restartGame = () => {
        console.log("Restarting the game...");
        board.restartBoard();
        board.initializeBoard();
    }

    return {playTurn, showRound, restartGame};

}

  function Player (playerName, playerToken) {

    const name = playerName;
    const token = playerToken;

    const getPlayer = () => {
        return {name, token}
    }

    return {getPlayer}

  }


  