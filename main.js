const display = (function() {
    function addControlListeners() {
        let playerModal = document.querySelector(".player-modal");
        playerModal.querySelector("button[type='button']").addEventListener('click', hidePlayerModal);
        playerModal.querySelector("button[type='submit']").addEventListener('click', (e) => { 
            game.setPlayers(e);
        });
        let optionsModal = document.querySelector(".options-modal");
        optionsModal.querySelector("button[type='button']").addEventListener('click', hideOptionsModal);
        optionsModal.querySelector("button[type='submit']").addEventListener('click', (e) => { changeVersion(e); });
        document.querySelector("#options-btn").addEventListener('click', showOptionsModal);
        document.querySelector("#new-game-btn").addEventListener('click', showPlayerModal);
        document.querySelector("#new-round-btn").addEventListener('click', game.startNewRound);
        document.querySelector("#player1-weapon").addEventListener('change', (e) => { propagateWeponChange(e) });
        document.querySelector("#player2-weapon").addEventListener('change', (e) => { propagateWeponChange(e) });
        document.querySelector("#versus-options").addEventListener('click', togglePlayer);
    }
    function togglePlayer() {
        let form = document.querySelector("#player-form");
        let secondPlayer = form.querySelector("#second-player");

        if (form.versus.value === "computer") {
            secondPlayer.classList.add("js-not-displayed");
        }else {
            secondPlayer.classList.remove("js-not-displayed");
        }        
    }
    function propagateWeponChange(e) {
        let id = e.target.getAttribute("id");
        let choice = e.target.value;
        let otherId = id === "player1-weapon" ? "player2-weapon" : "player1-weapon";
        let otherChoice = "";
        if (choice === "O") 
        {
            otherChoice = "X";
        } 
        else if (choice === "X") {
            otherChoice = "O";
        }
        else {
            otherChoice = "auto";
        }
        let otherTarget = document.querySelector(`#${otherId}`);
        otherTarget.value = otherChoice;
        
    }
    function setPlayerMessage(text) {
        [...document.querySelectorAll(".player-message")].forEach(e => {
            e.querySelector("p").textContent = text;
        });
    }
    function drawPage() {
        let height = window.innerHeight;
        let width = window.innerWidth;
        let area;
        let navWidth;
        if (width <= settings.orientationSwitchWidth
            || height <= settings.orientationSwitchWidth) {
            area = 1;
            navWidth = 0;
            settings.bigTicTacToe = false;
            settings.maxBoard = appParameters.smallBoardLimit;
            settings.winningNumber = appParameters.smallWinningNumber;
        }
        else {
            area = settings.boardArea;
            navWidth = settings.navWidth;
            
        }
        let cellsNbC = Math.floor(area * (width - navWidth)/settings.cellWidth);
        cellsNbC = Math.min(settings.maxBoard, cellsNbC);
        let cellsNbR = Math.floor(area * height / settings.cellHeight); 
        cellsNbR = Math.min(settings.maxBoard, cellsNbR);
        addControlListeners();   
        drawBoard(cellsNbC, cellsNbR);
        mainBoard.setBoard(cellsNbC, cellsNbR);
    }
    function reDrawBoard() {
        let height = window.innerHeight;
        let width = window.innerWidth;
        let area;
        let navWidth;
        if (width <= settings.orientationSwitchWidth
            || height <= settings.orientationSwitchWidth) {
            area = 1;
            navWidth = 0;
        }
        else {
            area = settings.boardArea;
            navWidth = settings.navWidth;
            
        }
        let cellsNbC = Math.floor(area * (width - navWidth)/settings.cellWidth);
        cellsNbC = Math.min(settings.maxBoard, cellsNbC);
        let cellsNbR = Math.floor(area * height / settings.cellHeight); 
        cellsNbR = Math.min(settings.maxBoard, cellsNbR);
        
        drawBoard(cellsNbC, cellsNbR);
        mainBoard.setBoard(cellsNbC, cellsNbR);
    }
    function drawBoard(cellsNbC, cellsNbR) {
        let board = document.querySelector(".board");
        board.innerHTML = "";
        board.setAttribute("style", `grid-template-columns: repeat(${cellsNbC}, 1fr)`);  
        for (let r = 0; r < cellsNbR; r++) {
            for (let c = 0; c < cellsNbC; c++) {
                let cell = document.createElement("div");
                cell.classList.add("cell");
                if (!settings.bigTicTacToe) {
                    cell.classList.add("js-big-cell");  
                }                                               
                cell.setAttribute("data-column", `${c}`);
                cell.setAttribute("data-row", `${r}`);          
                board.appendChild(cell);
                cell.addEventListener('click', (e) => game.playMove(e));
            }
        }
        if (!settings.bigTicTacToe) {
            board.classList.add("small-board");
        }
        else {
            board.classList.remove("small-board");
        }  
    }
    function update(cell, sign) {
        let signClass;
        if (sign === "X")
        {
            if (settings.bigTicTacToe) {
                signClass = "js-X";
            } else {
                signClass = "js-X-big-cell";
            }            
        }
        if (sign === "O") {
            if (settings.bigTicTacToe) {
                signClass = "js-O" ;   
            } else {
                signClass = "js-O-big-cell";
            }            
        }
        cell.classList.add(signClass)
    }
    function showPlayerModal() {

        //update the shape of the modal to current status of settings        
        let versusOptions = document.querySelector("#versus-options");
        if (settings.bigTicTacToe) {            
            versusOptions.classList.add("js-not-displayed");
        }else {
            versusOptions.classList.remove("js-not-displayed");        }
        let secondPlayer = document.querySelector("#second-player");
        let human = document.querySelector("#human");
        let computer = document.querySelector("#computer");
        if (game.getOpponent() === "human") {
            secondPlayer.classList.remove("js-not-displayed");
            human.checked = true;           
        } else {
            secondPlayer.classList.add("js-not-displayed");           
            computer.checked = true;
        }
        
        //show it now
        document.querySelector(".player-modal").classList.remove("js-not-displayed");
        document.querySelector(".shadow").classList.remove("js-not-visible");
    }
    function hidePlayerModal() {   
        console.log("HI from hide of playerModal");     
        document.querySelector(".player-modal").classList.add("js-not-displayed");
        document.querySelector(".shadow").classList.add("js-not-visible");
    }
    function showOptionsModal() {
        //update the modal with current status
        if (settings.bigTicTacToe) {
            document.querySelector("#big").checked = true;            
        }
        else {
            document.querySelector("#small").checked = true;
        }
        //and show it
        document.querySelector(".options-modal").classList.remove("js-not-displayed");
        document.querySelector(".shadow").classList.remove("js-not-visible");
    }
    function hideOptionsModal() {   
        console.log("HI from hide of optionsModal");     
        document.querySelector(".options-modal").classList.add("js-not-displayed");
        document.querySelector(".shadow").classList.add("js-not-visible");
    }
    function decorateCells(cellObjects) {
        let allCells = Array.from(document.querySelectorAll(".cell"));
        
        cellObjects.forEach(ob => {
            allCells.forEach(c => {
               if (c.getAttribute("data-row") == ob.row  && c.getAttribute("data-column") == ob.column) {
                    c.classList.add("js-winning");
                }
            });            
        });
    }
    function changeVersion(e) {
        e.preventDefault();
        let versusOptions = document.querySelector("#versus-options");
        let form = document.querySelector("#options-form");
        if (form.version.value === "small") {
            settings.bigTicTacToe = false;
            settings.maxBoard = appParameters.smallBoardLimit;
            settings.winningNumber = appParameters.smallWinningNumber;
            versusOptions.classList.remove("js-not-displayed");
        }else {
            settings.bigTicTacToe = true;
            settings.maxBoard = appParameters.bigBoardLimit;
            settings.winningNumber = appParameters.bigWinningNumber;
            versusOptions.classList.add("js-not-displayed");
        }
        game.deletePlayers();
        reDrawBoard(); 
        hideOptionsModal();
    }
    return {drawPage, update, reDrawBoard, showPlayerModal, hidePlayerModal, decorateCells, setPlayerMessage};
})();
const appParameters = {
    bigBoardLimit : 50,
    smallBoardLimit : 3,
    bigWinningNumber : 5,
    smallWinningNumber : 3  
}
const settings = {

    //these were defined in hope that limiting the size 
    //of AI will make it work for big version
    //for small version this concept is not necessary
    aiSize : 2,
    aiDepth : 10,

    //settings needed to calculate the number of cells
    //they are rewritten from CSS
    cellWidth : 35,
    cellHeight : 35,
    navWidth : 300,
    orientationSwitchWidth: 630,

    //fraction of available area occupied by board
    boardArea : 0.8,

    //below settings that are adjustable through options-modal
    bigTicTacToe : true,
    maxBoard : 50,
    winningNumber : 5
};

const boardMethods = {
    getData() {
        return this.data;
    },    
    setBoard(columns, rows) {
        this.data = []; //setting the new means cancelling the old 
        for (let r = 0; r < rows; r++) {
            let row = []
            for (let c = 0; c < columns; c++) {                
                let cell = {};
                cell.value = "-";
                cell.row = r;
                cell.column = c;
                row.push(cell)           
            }
            this.data.push(row);
        }
    },
    noMoves() {          
        let moves = [];         
        this.data.forEach(r => {
            r.forEach(c => {
                if(c.value === "-") {
                    moves.push(c)
                }
            });
        });        
        return moves.length <= 0;
    },
    addMove(column, row, weapon){
        this.data[row][column].value = weapon;
    },
    possibleMove(cellObject) {        
        return this.data[cellObject.row][cellObject.column].value === "-";
    },
    importData(otherData) {                
        this.data = JSON.parse(JSON.stringify(otherData));
    }
};
const boardFactory = function() {
    let data = []; 
    return Object.assign(Object.create(boardMethods), {data});
}
const mainBoard = boardFactory();
const playerFactory = function(name) {    
    let weapon;
    let score = 0;
    function getName() { return name;}
    function getWeapon() {return weapon; }
    function getScore() {return score; }
    function play(cellElement) {
        let column = Number(cellElement.getAttribute("data-column"));
        let row = Number(cellElement.getAttribute("data-row"));
        let move = {column, row}
        move.value = weapon;
       
        mainBoard.addMove(column, row, weapon);
        display.update(cellElement, weapon);    
    }
    function setWeapon(weap) {
        weapon = weap;
    }
    function addPoint() {
        score++;
    }
    return {getName, getWeapon, getScore, play, setWeapon, addPoint};
}
const AI = (function() { 
    
    let aiBoard = boardFactory();
    
    function getNewChilds(i, moves) {         
            let newChilds = [...moves];
            newChilds.splice(i, 1);
            return newChilds;
    }
    function getConsideredMoves(data) {        
        let size = settings.aiSize;
        let considered = [];        
        for (let row = 0; row < data.length ; row++){
            for (let column = 0; column < data[0].length; column++) {
                let neighbours = []
                //we collect neighbours of empty cells 
                if (data[row][column].value === "-") {
                    
                    //those to N
                    for (i = 1; i <= size; i++) {
                        if((row - i) >= 0) {
                            neighbours.push(data[row - i][column]);
                        }                    
                    }
                    //those S
                    for (i = 1; i <= size; i++) {
                        if((row + i) < data.length) {
                            neighbours.push(data[row + i][column]);
                        }   
                    }
                    //those to E
                    for (i = 1; i <= size; i++) {
                        if((column + i) < data[0].length) {
                            neighbours.push(data[row][column + i]);
                        }  
                    }
                    //those to W
                    for (i = 1; i <= size; i++) {
                        if((column - i)>= 0) {
                            neighbours.push(data[row][column - i]);
                        }  
                    }
                    
                    //those to S-E
                    for (i = 1; i <= size; i++) {
                        for (n = 1; n <= size; n++) {
                            if((row + n) < data.length && (column + i) < data[0].length) {
                                neighbours.push(data[row + n][column + i]);
                            } 
                        }            
                    }
                    //those to S-W
                    for (i = 1; i <= size; i++) {
                        for (n = 1; n <= size; n++) {
                            if((column - i) >= 0 && (row + n) < data.length) {
                                neighbours.push(data[row + n][column - i]);
                            } 
                        }            
                    }
                    //those to N-E
                    for (i = 1; i <= size; i++) {
                        for (n = 1; n <= size; n++) {
                            if((row - n) >= 0 && (column + i) < data[0].length) {
                                neighbours.push(data[row - n][column + i]);
                            }   
                        }            
                    }
                    //those to N-W
                    for (i = 1; i <= size; i++) {
                        for (n = 1; n <= size; n++) {
                            if((row - n) >= 0 && (column - i) >= 0) {
                                neighbours.push(data[row - n][column - i]);
                            }  
                        }            
                    }
                    //and check if any is busy
                    for (let n of neighbours) {
                        if (n.value  !== "-") {
                            considered.push(data[row][column]);
                            break;
                        }
                    }
                }
            }
        }       
        return considered;
    }
    function randomMiddle(data) {
        let row = Math.floor(data.length / 2);
        let column = Math.floor(data[row].length / 2);
        let rowRangeStart = Math.max(0, row - 2);
        let rowRangeEnd = Math.min(data.length -1, row + 2);
        let rowRange = rowRangeEnd - rowRangeStart;
        let randomRow = rowRangeStart + Math.floor(Math.random()*(rowRange +1));
        let columnRangeStart = Math.max(0, column - 2);
        let columnRangeEnd = Math.min(data[0].length -1, column + 2);
        let columnRange = columnRangeEnd - columnRangeStart;
        let randomColumn = columnRangeStart + Math.floor(Math.random()*(columnRange +1));

        return {row: randomRow, column: randomColumn, value: "-"};
    }
    function getComputerAnswerTo(move) {
        //here a move is the latest human move
        //it has column, row and value properties
        let column;
        let row;
        let answerMove;
        let value;
        //but if it is a computer who starts - it will only have value
        if (move.column === undefined || move.row == undefined) {
            answerMove = randomMiddle(mainBoard.getData());
            answerMove.value = oppositeValueTo(move);
        } else {
            column = move.column;
            row = move.row;            
            aiBoard.importData(mainBoard.getData());  
            let possibleMoves = getConsideredMoves(aiBoard.getData());              
            let minMax = minMaxValue(possibleMoves, column, row, aiBoard, true, 0, -1, 1, null);
            answerMove = minMax.bestMove; 
            value = minMax.value;
        }  
        console.log(`final bestMove is: ${answerMove}`);
        console.log(answerMove);
        console.log(`At final minmax value = ${value}`);
        let allCells = Array.from(document.querySelectorAll(".cell"));
        let answer = null;
        allCells.forEach(c => {
               if (c.getAttribute("data-row") == answerMove.row  && c.getAttribute("data-column") == answerMove.column) {
                    answer = c;
                }
            });            
        return answer; 
    }
    function oppositeValueTo(move) {
        return move.value === "X" ? "O" : "X";
    }
    function copyBoard(board) {
        let newBoard = boardFactory();
        newBoard.importData(board.getData());
        return newBoard;
    }
    function minMaxValue(possibleMoves, column, row, board, maximPlayer, depth, a, b) {
        //move here - is just applied one to the fresh copy of board
        depth++; 
        let data = board.getData();       
        let move = data[row][column];
        //console.log(`depth = ${depth}, move.row = ${move.row}, 
        //move.column ${move.column}, move.value = ${move.value}`);
        //console.log(possibleMoves);
        if (depth > settings.aiDepth) {
            let value = -1;        
            return {depth, value};
        }
        if (result.getWinningCells(move, data)) {
            if (maximPlayer) {
                let value = -1;                
                return {value, depth};            
            }
            else {
                let value = 1;                
                return {value, depth}
            }            
        }
        else {
            let childMoves = possibleMoves;            
            //console.log(childMoves);
            if (childMoves.length === 0){
                let value = 0;                
                return {value, depth};
            }
            if (maximPlayer) {
                let value = -1;
                let bestMove = childMoves[0];
                for (let i = 0; i < childMoves.length; i++) {
                    let m = childMoves[i];
                    let newBoard = copyBoard(board);
                    let moveValue = oppositeValueTo(move);
                    newBoard.addMove(m.column, m.row, moveValue);
                    let newChilds = getNewChilds(i, childMoves);                    
                    let moveMinMax =  minMaxValue(newChilds, m.column, m.row, newBoard, false, depth, a, b); 
                    let tempValue = moveMinMax.value;
                    //if (depth === 1) {aiAnswers.push({m, tempValue, depth});}
                    if (moveMinMax.value > value) {
                        value = moveMinMax.value;
                        bestMove = m;
                        //this below can not be set here as it will modify m fo other children
                        //bestMove.value = moveValue;                      
                    }                    
                    a = Math.max(a, value);                    
                    if (a >= b) {                        
                        return {value, depth, bestMove}; 
                    }        
                }  
                /*
                if (depth === 1) 
                {
                    console.log("proposed best move is:");
                    console.log (bestMove);
                    console.log (`At minmax value: ${value}`);
                } 
                */           
                return {value, depth, bestMove};  
            }
            else {
               let value = 1;                          
               for (let i = 0; i < childMoves.length; i++) {
                    let m = childMoves[i];
                    let newBoard = copyBoard(board); 
                    let moveValue = oppositeValueTo(move);
                    newBoard.addMove(m.column, m.row, moveValue);
                    let newChilds = getNewChilds(i, childMoves);
                    let moveMinMax =  minMaxValue(newChilds, m.column, m.row, newBoard, true, depth, a, b);                                 
                    value = Math.min(value, moveMinMax.value);  
                    b = Math.min(b, value);                    
                    if ( b <= a ) {
                        return {value, depth}; 
                    }
                }
                return {value, depth}; 
            }  
        }  
    }
    return { getComputerAnswerTo}; 
})();
const result = (function() {
    function getCheckArray(column, row, data) {
        let checkArray = [];
        checkArray.push(getRowAxis(column, row, data));
        checkArray.push(getColumnAxis(column, row, data));
        checkArray.push(getLeftAxis(column, row, data));
        checkArray.push(getRightAxis(column, row, data));
        return checkArray;
        
    }
    function getRowAxis(column, row, data) {
        let axis = [];
        let start = Math.max(0, column - 4)
        let end = Math.min(column + 5, data[row].length);
        axis = data[row].slice(start, end);               
        return axis;
    }
    
    function getColumnAxis(column, row, data) {
        let axis = [];
        let start = Math.max(0, row - 4);
        let end = Math.min(row + 5, data.length);        
        axis = data.map(r => r[column]).slice(start, end);        
        return axis;
    }
    function getLeftAxis(column,row, data) {
        let axis = [];        
        let endR = Math.min(row + 5, data.length);        
        let endC = Math.min(column + 5, data[row].length);
        let c = column - 4;
        let r = row -4;        
        while (c < 0 || r < 0) {
            c++;
            r++;         
        }
        while (c < endC && r < endR) {
            axis.push(data[r][c]);
            c++;
            r++; 
        }      
        return axis;
    }
    function getRightAxis(column,row, data) {
        let axis = []; 
        let endC = Math.min(column + 5, data[row].length);
        let c = column - 4;
        let r = row +4;       
        while (c < 0 || r >= data.length) {
            c++;
            r--;
        }
        while (c < endC && r >= 0) {
            axis.push(data[r][c]);
            c++;
            r--;   
        }
        return axis;
    }
    function findWinnigCells(axis, value) {
        let wins = [];            
        for (let i = 0; i < axis.length; i++) {
            if (axis[i].value === value) {
                wins.push(axis[i])
            }
            else {
                wins = [];
            }
            if (wins.length >= settings.winningNumber) {
                return wins;
            }            
        }
        return null;
    }
    function getWinningCells(cellObject, data){        
        let column = cellObject.column;
        let row = cellObject.row;
        let value = cellObject.value;
        let checkArray = getCheckArray(column, row, data);
        
        let winningCells = null;
        for (let axis of checkArray) {
            let winsOnAxis = findWinnigCells(axis, value);
            if (winsOnAxis) {
                winningCells = winsOnAxis;
                break;
            }
        }
        //console.log(data);
        //console.log(cellObject);      
        //console.log(winningCells);
        return winningCells;
    }    
    return {getWinningCells};
})();
const game = (function() {
    let humanOpponent = true;
    let player1 = null;
    let player2 = null;
    let activePlayer = null;
    let autoWeapon = true; //will make a weapon change each round
    let gameover = false;

    function deletePlayers() {
        player1 = null;
        player2 = null;
        activePlayer = null;
        humanOpponent = true;

        gameover = false;

         //hide players info
         [...document.querySelectorAll(".player")].forEach(e => e.classList.add("js-not-displayed"));
         [...document.querySelectorAll(".player-message")].forEach(e => e.classList.add("js-not-visible"));

         //hide draw-message if any
         document.querySelector(".draw-message").classList.add("js-not-visible");

         //and hide controls
         document.querySelector(".controls").classList.add("js-not-displayed");

    }
    function setPlayers(e) {        
        e.preventDefault();
        console.log("setting players");
        //new players is always a new game
        deletePlayers();    
        display.reDrawBoard(); 
        let form = document.querySelector("#player-form");       
        player1 = playerFactory(form.name1.value);
        let opponent = form.versus.value;
        if (opponent === "human") {
            humanOpponent = true;
            player2 = playerFactory(form.name2.value);
        }
        else {
            humanOpponent = false;
            player2 = playerFactory("Computer");
        }
        let weapon1 = form.player1Weapon.value;
        let weapon2 = form.player2Weapon.value;
        if (weapon1 === "auto" || weapon2 === "auto") {
            weapon1 = "X";
            weapon2 = "O"
        }
        else {
            autoWeapon = false;
        }
        player1.setWeapon(weapon1);
        player2.setWeapon(weapon2);
       
        display.setPlayerMessage("Your move!");   
        setActivePlayer(player1);
        updatePlayersInfo();

        //showing players info
        [...document.querySelectorAll(".player")].forEach(e => e.classList.remove("js-not-displayed"));

        //and showing controls
        document.querySelector(".controls").classList.remove("js-not-displayed");

        display.hidePlayerModal();
    }
    function updatePlayersInfo() {
        let name1Element = document.querySelector("#player1-name");
        let name2Element = document.querySelector("#player2-name");        
        name1Element.textContent = player1.getName();
        name2Element.textContent = player2.getName();

        let weapon1Element = document.querySelector("#weapon1-info");
        let weapon2Element = document.querySelector("#weapon2-info");
        weapon1Element.textContent = player1.getWeapon();
        weapon2Element.textContent = player2.getWeapon();

        let score1Element = document.querySelector("#player1-score");
        let score2Element = document.querySelector("#player2-score");
        score1Element.textContent = player1.getScore();
        score2Element.textContent = player2.getScore();
    }
    
    
    function playMove(e) {
        let cellElement = e.target;        
        let cellObject = {};
        cellObject.column = Number(cellElement.getAttribute("data-column"));
        cellObject.row = Number(cellElement.getAttribute("data-row"));
       
        if (gameover) {
            return;
        }

        if (!!player1 && !!player2) {            
            if (!mainBoard.possibleMove(cellObject)) {
                return;
            }            
            activePlayer.play(cellElement); 
            console.log(player2.getName());
        }    
        else {
            display.showPlayerModal();        
            return;
        }
        cellObject.value = activePlayer.getWeapon();
        let winningCells = result.getWinningCells(cellObject, mainBoard.getData())
        if(winningCells){            
            display.decorateCells(winningCells);
            activePlayer.addPoint();  
            updatePlayersInfo();
            display.setPlayerMessage("You won!"); 
            gameover = true;     
            console.log("game confirms: end of game");
        } 
        else {
            if(mainBoard.noMoves()) {
                makeDraw();
                console.log("Game says: it is a draw");
                return;
            }            
            let nextPlayer = activePlayer === player1 ? player2 : player1;
            setActivePlayer(nextPlayer);            
            if (!humanOpponent && activePlayer === player2) {
               computerAnswerTo(cellObject);
            }
            console.log(`game says: we continue with player ${activePlayer.getName()}`);            
        }    
    }
    function makeDraw() {
        gameover = true;
        let drawMessage = document.querySelector(".draw-message");
        drawMessage.classList.remove("js-not-visible");
        //de-prompt last player
        let message1 = document.querySelector("#player1-message");
        let message2 = document.querySelector("#player2-message");
        let plate1 = document.querySelector("#player1-plate");
        let plate2 = document.querySelector("#player2-plate");
        if (activePlayer === player1) {
            plate1.classList.remove("js-playing");     
            message1.classList.add("js-not-visible");       
        }
        else {            
            plate2.classList.remove("js-playing");
            message2.classList.add("js-not-visible");
        }        
    }
    function computerAnswerTo(move) {
        let cellElement = AI.getComputerAnswerTo(move)
        console.log(cellElement);
        playMove({target: cellElement});
    }
    function startNewRound() {

        if (!player1 || !player2) {
            display.showPlayerModal();        
            return;
        }

        gameover = false;
        //hide draw message if any        
        document.querySelector(".draw-message").classList.add("js-not-visible");

        //always the player who lost would start a new round
        let nextPlayer = activePlayer === player1 ? player2 : player1;
        setActivePlayer(nextPlayer);
        if (autoWeapon) {
            let weapon1 = player1.getWeapon();
            let wapon2 = player2.getWeapon();
            player1.setWeapon(wapon2);
            player2.setWeapon(weapon1);
        }
        updatePlayersInfo();
        display.setPlayerMessage("Your move!");
        display.reDrawBoard();
        if (!humanOpponent && activePlayer === player2) {
            move = {};
            move.value = player1.getWeapon();
            computerAnswerTo(move);
         }
    }
    function setActivePlayer(player) {
        activePlayer = player;
        let message1 = document.querySelector("#player1-message");
        let message2 = document.querySelector("#player2-message");
        let plate1 = document.querySelector("#player1-plate");
        let plate2 = document.querySelector("#player2-plate");
        if (player === player1) {
            plate1.classList.add("js-playing");
            plate2.classList.remove("js-playing")
            message1.classList.remove("js-not-visible");
            message2.classList.add("js-not-visible");
        }
        else {
            plate1.classList.remove("js-playing");
            plate2.classList.add("js-playing");
            message1.classList.add("js-not-visible");
            message2.classList.remove("js-not-visible");

        }        
    }
    function getOpponent() {
        if (humanOpponent) {
            return "human";
        }
        else {
            return "computer";
        }
    }
    return {playMove, setPlayers, deletePlayers, startNewRound, getOpponent };
})();

document.addEventListener("DOMContentLoaded", () => {      
    display.drawPage();
});



