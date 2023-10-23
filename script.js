const gameBoard = (() => {
    let player;
    let round;
    let grid;
    let squareID;

    const initialize = () => {
        goLight("light-1");

        const outcome = document.getElementById("outcome");
        const squares = document.querySelectorAll(".square");
        squares.forEach((item) => {
            item.style.backgroundImage = "";
        });

        if (document.getElementById("start").innerHTML == "START") {
            document.getElementById("start").innerHTML = "RESTART";
            document.getElementById("change-btn").style.visibility = "hidden";
        }
        else {
           window.location.reload();
        }
        outcome.innerHTML = "";

        gameBoard.player = "player1";
        gameBoard.round = 0;
        gameBoard.grid = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
        gameBoard.squareID = "";
    }

    const goLight = function (onLight) {
        let offLight;

        if (onLight.charAt(6) == "1") {
            offLight = "light-2";
        }
        else {
            offLight ="light-1";
        }

        document.getElementById(onLight).style.backgroundColor = "rgb(0, 255, 0)";
        document.getElementById(onLight).style.scale = 1.2;
        document.getElementById(offLight).style.backgroundColor = "gray";
    };

    const playRound = function (player, round, grid, squareID) {
        if (round % 2 == 0) {
            goLight("light-2");
            mark = "url('images/x.svg')";
            points = 1;
        }
        else {
            goLight("light-1");
            mark = "url('images/o.svg')";
            points = 10;
        }

        grid[parseInt(squareID.charAt(1))][parseInt(squareID.charAt(4))] = points;             
        document.getElementById(squareID).style.backgroundImage = mark;
    };

    return {
        player,
        round,
        grid,
        squareID,
        initialize,
        playRound,
    };

})();

const controller = (() => {
    const play = () => {
        document.getElementById("change-btn").addEventListener("click", playerNames);
        document.getElementById("start").addEventListener("click", playGame);
    }

    const playerNames = () => {
        const changeNames = document.getElementById("change-btn");
        const nameDialog = document.getElementById("name-dialog");
        const nameForm = document.getElementById("name-form");
        const player1 = document.getElementById("player-1");
        const player2 = document.getElementById("player-2");
        changeNames.style.visibility = "hidden";
        nameDialog.showModal();

        nameForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name1 = document.getElementById("newName1");
            const name2 = document.getElementById("newName2");

            if (name1.value == "") {
                name1.value = "Player 1";
            }
            if (name2.value == "") {
                name2.value = "Player 2";
            }
            player1.innerHTML = name1.value;
            player2.innerHTML = name2.value;
            nameDialog.close();
            nameForm.removeEventListener("submit", (e));
        });
        document.getElementById("change-btn").removeEventListener("click", playerNames);
    }

    const playGame = () => {
        gameBoard.initialize();
        document.getElementById("game-board").addEventListener("click", getID);

        function getID(e){
            const clickID = e.target.id;
            gameBoard.squareID = "";

            const clickSquare = document.getElementById(clickID);
            if (clickSquare.style.backgroundImage == "") {
                gameBoard.squareID = clickID;
                let gameOver = updateBoard(clickID);
                if (gameOver) {
                    document.getElementById("game-board").removeEventListener("click", getID);
                }
            }
        }
    }

    const updateBoard = (markID) => {
        gameBoard.squareID = markID;
        gameOver = false;

        gameBoard.playRound(gameBoard.player, gameBoard.round, gameBoard.grid, gameBoard.squareID);
        let winner = checkWinner();

        if (winner == "") {
            gameBoard.round++;
            if (gameBoard.player == "player1") {
                gameBoard.player = "player2"
            }
            else {
                gameBoard.player = "player1"
            }
        }
        else {
            if (winner != "") {
                outcome.innerHTML = `${winner} is the winner!`;
            }
            else if (gameBoard.round == 9 && winner == "") {
                outcome.innerHTML = "No winner - the game is a draw";
            }
            gameOver = true;
        }
        return gameOver;
    }

    const checkWinner = () => {
        let winner = "";

        // Check rows for sums
        let row1Sum = 0;
        for (i = 0; i < 3; i++) {
            row1Sum = row1Sum + gameBoard.grid[0][i];
        }
        let row2Sum = 0;
        for (i = 0; i < 3; i++) {
            row2Sum = row2Sum + gameBoard.grid[1][i];
        }
        let row3Sum = 0;
        for (i = 0; i < 3; i++) {
            row3Sum = row3Sum + gameBoard.grid[2][i];
        }

        // Check columns for sums
        let col1Sum = 0;
        for (i = 0; i < 3; i++) {
            col1Sum = col1Sum + gameBoard.grid[i][0];
        }
        let col2Sum = 0;
        for (i = 0; i < 3; i++) {
            col2Sum = col2Sum + gameBoard.grid[i][1];
        }
        let col3Sum = 0;
        for (i = 0; i < 3; i++) {
            col3Sum = col3Sum + gameBoard.grid[i][2];
        }

        // Check diagonals for sums
        let diag1Sum = 0;
        for (i = 0; i < 3; i++) {
            diag1Sum = diag1Sum + gameBoard.grid[i, i];
        }
        let diag2Sum = 0;
        for (i = 0; i < 3; i++) {
            for (j = 2; j >= 0; j--){
                diag2Sum = diag2Sum + gameBoard.grid[i, j];
            }
        }

        let sumArray = [row1Sum, row2Sum, row3Sum, col1Sum, col2Sum, col3Sum, diag1Sum, diag2Sum];

        i = 0;
        while (i < sumArray.length && winner == "") {
            if (sumArray[i] == 3) {
                winner = document.getElementById("player-1").innerHTML;
            }
            else if (sumArray[i] == 30) {
                winner = document.getElementById("player-2").innerHTML;
            }
            i++;
        }

        if (winner == "" && gameBoard.round == 8) {
            winner = "draw";
        }

        return winner;
    }

    return {
        play,
    }

})();

controller.play();
