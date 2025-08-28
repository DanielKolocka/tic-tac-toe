
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

        // console.log("Row: " + row);
        // console.log("Column: " + column);

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
        initializeBoard();
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
        // console.log("Value added is: " + value);
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
    // const screenController = ScreenController();

    const players = [
        Player("Player 1", "X", 0),
        Player("Player 2", "Y", 0)
    ];

    let activePlayer = players[0];
    let count = 0;

    const getPlayers = () => {
        return players;
    }

    // Switch the active player
    const switchActivePlayer = () => {
        activePlayer = (activePlayer == players[0]) ? players[1] : players[0];
        console.log("Switching player to: " + activePlayer.getPlayer().name);
    }

    // Play a turn for the active user
    const playTurn = (gridSpot) => {
        if (board.placeToken(gridSpot, activePlayer)) {
            count++;
            // screen.updateBoard();
    
            const winner = isWinningMove();
            
            if (winner) {
                screen.updateBoard();
                announceWinner(activePlayer);
                return; 
            } else if (count >= 9) { //On turn 9 if it's a win that will be called before this. Otherwise, it's a tie
                console.log("It's a tie!");
                return;
            } else {
                switchActivePlayer(); 
                screen.updateBoard();
                return;
            }
        }
    }

    const showRound = () => {
        board.printBoard();
    }

    const isWinningMove = () => {
        let game = board.getBoard();
        showRound();
        // Check horizonat and vertical win
        for (let i=0; i<3; i++) {
            if (game[i][0].getValue() != '' && (game[i][0].getValue() == game[i][1].getValue()) && (game[i][0].getValue() == game[i][2].getValue())) {
                console.log("win 1");
                return game[i][0];
            }
            if (game[0][i].getValue() != '' && (game[0][i].getValue() == game[1][i].getValue()) && (game[0][i].getValue() == game[2][i].getValue())) {
                console.log("win 2");
                return game[0][i];
            }
        }
        // Check diaganol win
        if (game[1][1].getValue() != '' && 
            ( (game[0][0].getValue() == game[1][1].getValue() && game[0][0].getValue() == game[2][2].getValue()) ||
            (game[2][0].getValue() == game[1][1].getValue() && game[2][0].getValue() == game[0][2].getValue()) )
            ) {
    console.log("win 3");
    return game[1][1];
}
        console.log("No winner yet!");
        return false;
    }

    const announceWinner = (winningPlayer) => {
        console.log(winningPlayer.getPlayer().name + " has won!");
        screen.displayWinner(winningPlayer.getPlayer());
        // return winningPlayer.getPlayer().name;
        winningPlayer.increaseScore();
        console.log(winningPlayer.getPlayer());
        return;
    }

    const restartGame = () => {
        console.log("Restarting the game...");
        board.restartBoard();
        activePlayer = players[0];
        count = 0;
        players.forEach(player => {
            player.resetScore();
        });


        // TO-DO: Reset the scores of the players
        // board.initializeBoard();
    }

    const playNext = () => {
        console.log("Starting next game...");
        board.restartBoard();
        activePlayer = players[0];
        count = 0;
    }

    const getActivePlayer = () => {
        return activePlayer;
    }

    return {playTurn, showRound, restartGame, getBoard: board.getBoard, getActivePlayer, playNext, getPlayers};

}

  function Player (playerName, playerToken, playerScore) {

    const name = playerName;
    const token = playerToken;
    let score = playerScore;

    const getPlayer = () => {
        return {name, token, score}
    }

    const resetScore = () => {
        score = 0;
    }

    const increaseScore = () => {
        score++;
    }

    return {getPlayer, resetScore, increaseScore}

  }

  function ScreenController () {
    const game = GameController();
    const players = game.getPlayers();
    // const playerTurnDiv = document.querySelector('.turn');
    const player1Name = document.querySelector('.playerName1');
    const player1Score = document.querySelector('.playerScore1');
    const player2Name = document.querySelector('.playerName2');
    const player2Score = document.querySelector('.playerScore2');

    const currentPlayerTurn = document.querySelector('.playerTurn');
    const boardDiv = document.querySelector('.board');
    const resetButton = document.querySelector('.resetButton');

    const dialog = document.querySelector("dialog");
    const dialogResult = document.querySelector(".result");
    const dialogNextButton = document.querySelector(".nextGameButton");
    dialogNextButton.addEventListener('click', (e) => {
        e.preventDefault();
        game.playNext();
        updateBoard();
        dialog.close();
    });


    resetButton.addEventListener('click', () => {
        game.restartGame();
        // initializeBoard();
        updateBoard();
        console.log("restart button clicked");
    });

    // const board = game.getBoard();

    const updateBoard = () => {
        const board = game.getBoard();
        boardDiv.innerHTML = '';
        currentPlayerTurn.textContent = `${game.getActivePlayer().getPlayer().name}'s Turn...`;

        player1Score.innerHTML = `Score: ${players[0].getPlayer().score}`; 
        player2Score.innerHTML = `Score: ${players[1].getPlayer().score}`; 


        // TO-DO: Add the scores...
        let count = 0;
        board.forEach(row => {
            row.forEach(cell => {
                const newCell = document.createElement("button");
                newCell.setAttribute("class", "cell");
                newCell.setAttribute("id", count++);
                if (cell.getValue() != "0") {
                    newCell.textContent = cell.getValue();
                }
                newCell.addEventListener("click", (e) => {
                    // console.log(e.target.id);
                    game.playTurn(e.target.id);
                });
                boardDiv.appendChild(newCell);
            });
        });

    }


    // FINISH THIS: Update the current turn to display winner. And check winner market to determine which score to update +1
    const displayWinner = (winner) => {
        currentPlayerTurn.textContent = `${winner.name} is the winner!`;
        console.log('winner: ' + winner.name);
        dialogResult.textContent = `${winner.name} is the winner!`
        dialog.showModal();

    }


    // initializeBoard();
    updateBoard();
    return {displayWinner, updateBoard};

  }

  const screen = ScreenController();

