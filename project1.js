let gamestate = [["","","","","","","",""], ["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],["","","","","","","",""]] //use object properties instead
    // use Token.position {x, y} to log the token at gamestate[y][x]. log token by token.id?
    // currently gamestate[y][x] corresponds to coordinate(x, y) on the game board.

let player1
let player2 
let playersArr = [player1, player2]    
let piecesRed = [];
let capturedRed = [];
let piecesBlue = [];
let capturedBlue = [];
let piecesCheckers = [];
let movingPiece = "";
let threatenedPiece = ''
let targetSq = []

const clearBoard = [["","","","","","","",""], ["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],["","","","","","","",""]]
const checkersStart = [[1,3,5,7],[0,2,4,6],[1,3,5,7],[],[],[0,2,4,6],[1,3,5,7],[0,2,4,6]]
const testBoard = [[],[],[3],[0,2,6],[1,5],[],[3,5],[]]
const tiles = document.querySelectorAll(".tile")
const gameBoard = document.getElementById("gameboard")
let gamePieces = document.querySelectorAll(".game-piece") 
const gamePiecesRed = document.getElementsByClassName("Red")
const gamePiecesBlue = document.getElementsByClassName("Blue")
//
//
class Player {
    constructor () {
        this.turn = false;
        this.captures = 0;
        this.lose = false; //might remove, can use to trigger game end state
    }
}

class Check1 extends Player {
    constructor (color = "Red") {
        super()
        this.name = "Player 1"
        this.color = color
        this.pieces = piecesRed
        this.score = capturedBlue.length
    }
    loser() {
        if (this.pieces.length === 0) {
            this.lose = false
        }
    }
}

class Check2 extends Player {
    constructor (color = "Blue") {
        super()
        this.name = "Player 2"
        this.color = color
        this.pieces = piecesBlue
        this.score = capturedRed.length
    }
    loser() {
        if (this.pieces.length === 0) {
            this.lose = true
        }
    }
}

class Token {
    constructor (pos, id) {
        this.id = id
        this.position = {
            x: pos.x ,
            y: pos.y
        } //entered as numbers on a grid, where {0, 0} would correspond to a1, {7, 4} = h5, etc.
        this.promoted = false //default
        this.captured = false //default
        this.jumping = false //default
    }
}

class Red extends Token {
    constructor (pos, id, color = "red") {
        super(pos, id);
        this.color = color //enter as blue or red;         
    }
    promotion() {
        if (this.position.y === 7) {
            this.promoted = true
            console.log("king me")
        }
    }
}

class Blue extends Token {
    constructor (pos, id, color = "blue") {
        super(pos, id);
        this.color = color //enter as blue or red;
    }
    promotion() {
        if (this.position.y === 0) {
            this.promoted = true
            console.log("king me")
        }
    }
}

// TESTING //

function testGame () {
    
    let id = 1
    for (let i = 0; i < testBoard.length; i++) {
        for (let j = 0; j < testBoard[i].length; j++) {
            if (i < 4) {
                let tokenGen = new Red ({x: testBoard[i][j], y: i}, id, "Red")
                setPieceToBoard(tokenGen);
                piecesRed.push(tokenGen);

            } else if (i > 3) {
                let tokenGen = new Blue ({x: testBoard[i][j], y: i}, id, "Blue")
                setPieceToBoard(tokenGen);
                piecesBlue.push(tokenGen);
            }
            id++;
        }
    }

    createCheckersPlayers();
    setCheckersGamestate();
    player1.turn = true;
    console.log(player1)
    console.log(player2)
    console.log("gameStart works")
    
    playersArr = [player1, player2]
    
    turnStart();
}

// TESTING //

function deleteTokens () {
    gamePieces = document.querySelectorAll(".game-piece")
    for (i = 0; i < gamePieces.length; i++) {
        gamePieces[i].parentNode.removeChild(gamePieces[i]);
    }
}

function deleteMoveIndicators () {
    let movementIndicators = document.querySelectorAll(".move-indicator")
    movementIndicators.forEach(indicator => {
        indicator.classList.remove('move-indicator');
        indicator.removeAttribute("onclick")
        }) 
    let captureIndicators = document.querySelectorAll(".capture-indicator")
    captureIndicators.forEach(indicator => {
        indicator.classList.remove('capture-indicator');
        indicator.removeAttribute("onclick")
    }) 
}

function cleanUp () {
    //console.log("cleanup debug")
    movingPiece = ""
    targetSq.forEach(target => {
        document.getElementById(`${target}`).removeAttribute("onclick")
    })

    targetSq = []

    jumpCleanup ();

    document.querySelectorAll(".active").forEach(piece => {
        piece.classList.remove("active")
        piece.removeAttribute("onclick")
    })

    piecesCheckers.forEach (jumper => {
        jumper.jumping = false
    })
}

function jumpCleanup () {
    deleteMoveIndicators(); 
    document.querySelectorAll(".active").forEach(piece => {
        piece.classList.remove("active")
        piece.removeAttribute("onclick")
    })
    threatenedPiece = ''


    for (i = 0; i < piecesRed.length; i++) {
        piecesRed[i].promotion()
        if (piecesRed[i].promoted === true){
            document.querySelector(`#p${piecesRed[i].id}`).classList.add("promoted")
        } 
    }
    for (i = 0; i < piecesBlue.length; i++) {
        piecesBlue[i].promotion()
        if (piecesBlue[i].promoted === true){
            document.querySelector(`#p${piecesBlue[i].id}`).classList.add("promoted")
        } 
    }

    
   
}

function resetGamestate() {
    gamestate = clearBoard
    player1 = ""
    player2 = "" 
    piecesRed = [];
    piecesBlue = [];
    deleteTokens();
}

function setCheckersGamestate() {
    piecesCheckers = piecesRed.concat(piecesBlue);
    piecesCheckers.forEach(i => {
        gamestate[i.position.y].splice(i.position.x, 1, i/*.id*/)
    }) // currently gamestate[i][j] corresponds to coordinate(x=j, y=i) on the game board.
}

function createCheckersPieces () {
    let id = 1
    for (let i = 0; i < checkersStart.length; i++) {
        for (let j = 0; j < checkersStart[i].length; j++) {
            if (i < 3) {
                let tokenGen = new Red ({x: checkersStart[i][j], y: i}, id, "Red")
                setPieceToBoard(tokenGen);
                piecesRed.push(tokenGen);

            } else if (i > 4) {
                let tokenGen = new Blue ({x: checkersStart[i][j], y: i}, id, "Blue")
                setPieceToBoard(tokenGen);
                piecesBlue.push(tokenGen);
            }
            id++;
        }
    }
}

function createCheckersPlayers () {
    player1 = new Check1
    player2 = new Check2 
}

function findPiece(idVal) {
    for (i = 0; i < gamestate.length; i++) {
        for (j = 0; j < gamestate[i].length; j++)
        if (gamestate[i][j].id === idVal) {
          //console.log (`Found piece ${gamestate[i][j].id} at gamestate[${i}][${j}].`)
          return gamestate[i][j] 
        } 
    }
}

function findPosition({name: dir, x: row, y: col}) {
    console.log("findPosition")
    if (row > 7 || col > 7 || row < 0 || col < 0) {
        return null
    } else if (gamestate[col][row] === undefined){
        return null
    } else{
        return gamestate[col][row];
    }
}

function setPieceToBoard(newPiece) {
    let divId = ("(" + newPiece.position.x + ", " + newPiece.position.y +")")
    const divLocation = document.getElementById(divId)
    const newToken = document.createElement("div");
    newToken.classList.add("game-piece")
    newToken.classList.add(newPiece.color)
    newToken.setAttribute("id", `p${newPiece.id}`)
    //newToken.innerHTML = newPiece.id  
    divLocation.appendChild(newToken)
        
    //for game piece "a", converts a.position into a string to match the ID of a div element
    //then finds that div element, creates a new div representing the game piece, and appends it
    //as a child to the game board.
}

function removePieceFromBoard(threatenedPiece) {
    gamestate[threatenedPiece.position.y][threatenedPiece.position.x] = ""
    piecesRed.forEach(piece => {
        if (piece = threatenedPiece) {
            piece.captured = true
        }
    })
    piecesBlue.forEach(piece => {
        if (piece = threatenedPiece) {
            piece.captured = true
        }
    })
}


function gameStart() {

    resetGamestate();
    createCheckersPieces();
    createCheckersPlayers();
    setCheckersGamestate();
    player1.turn = true;
    console.log(player1)
    console.log(player2)
    console.log("gameStart works")
    
    playersArr = [player1, player2]
    
    turnStart();
};

// Core turn loop functions in order
//
function turnStart () {
    playersArr.forEach(player => {
        if (player.turn === true) {
            console.log(player)
            let activePieces = document.querySelectorAll(`.${player.color}`)
            activePieces.forEach(piece => {
                piece.classList.add("active")
            })
            player.pieces.forEach(piece => {
                //console.log(piece)
                if (piece.captured === false) {
                let activatePiece = document.querySelector(`#p${piece.id}`)
                activatePiece.setAttribute('onclick', `selectPiece(${piece.id})`)
                } 
            })
        }
    })
}

function selectPiece(evt) {
    console.log("selectPiece")
    let selectedPiece = findPiece(evt)
    moveFinder(selectedPiece)
}

function moveFinder(selectedPiece) {        
    deleteMoveIndicators();
    //Movement rules
        let ul = {
            name: "ul",
            x: selectedPiece.position.x-1,
            y: selectedPiece.position.y+1
        }
        let ur = {
            name: "ur",
            x: selectedPiece.position.x+1,
            y: selectedPiece.position.y+1
        }
        let dl = {
            name: "dl",
            x: selectedPiece.position.x-1,
            y: selectedPiece.position.y-1
        }
        let dr = {
            name: "dr",
            x: selectedPiece.position.x+1,
            y: selectedPiece.position.y-1
        }
        let movOpt = [ul, ur, dl, dr]
    //Capture Rules
        let cul = {
            name: "cul",
            x: selectedPiece.position.x-2,
            y: selectedPiece.position.y+2
        }
        let cur = {
            name: "cur",
            x: selectedPiece.position.x+2,
            y: selectedPiece.position.y+2
        }
        let cdl = {
            name: "cdl",
            x: selectedPiece.position.x-2,
            y: selectedPiece.position.y-2
    
        }
        let cdr = {
            name: "cdr",
            x: selectedPiece.position.x+2,
            y: selectedPiece.position.y-2
        }
        let capOpt = [cul, cur, cdl, cdr]
    
    if (selectedPiece.promoted === false) {
        if (selectedPiece.color === "Red") {
            movOpt = [ul, ur]
            capOpt = [cul, cur]
        } else if (selectedPiece.color === "Blue") {
            movOpt = [dl, dr]
            capOpt = [cdl, cdr]
        }
    }         
    
        let moveChecker = []
        for (i = 0; i < movOpt.length; i++) {
            moveChecker.push(findPosition(movOpt[i]))
        } //finds if there is a game piece at the location of a given movement rule.
    
        let movValid = [null,null,null,null]
        let capValid = [null,null,null,null]
        
        //Move checking logic tree
        
            for (i = 0; i < moveChecker.length ; i++) {
                if (moveChecker[i] === undefined || moveChecker[i] === null){
                    console.log ("passed")
                } else if (moveChecker[i].color===selectedPiece.color) {
                    console.log ("passed")
                } else if (moveChecker[i].color !== selectedPiece.color && moveChecker[i] !== ""){
                    console.log(capOpt[i])
                    if (findPosition(capOpt[i]) === "") {
                        capValid.splice(i, 1, capOpt[i])
                    }
                } else if (moveChecker[i] === "" && selectedPiece.jumping === false){
                    movValid.splice(i, 1, movOpt[i])
                } 
            }

        //End of logic tree

        turnEnder = []
        validArr = movValid.concat(capValid)
        validArr.forEach (item => {
            if (item !== null) {
                turnEnder.push(item)
            }
        })
        //creates a condition to easily check if there are valid selections for a piece

        if (turnEnder.length === 0) {
            console.log ("no valid moves for this piece")
            deleteMoveIndicators();
            if (selectedPiece.jumping === true) {
                cleanUp()
                turnEnd()
            } 
        } 
        //only ends the turn if jumping because selecting a piece with no movement options doest take a turn

    for (i = 0; i < movValid.length; i++) {
        if (movValid[i] !== null) {
            console.log(movValid)
            let divId = `(${movValid[i].x}, ${movValid[i].y})` 
            const divLocation = document.getElementById(divId)
            divLocation.classList.add("move-indicator")
            divLocation.setAttribute('onclick', `selectMove("${divId}");`) 
            targetSq.push(divId)
        }
    } //creates targetable tokens
        
        
    capValid.forEach (capture => {   
        if (capture !== null){
            let divId = `(${capture.x}, ${capture.y})` 
            const divLocation = document.getElementById(divId)
            divLocation.classList.add("capture-indicator")
            divLocation.setAttribute('onclick', `jump("${divId}");`) 
            targetSq.push(divId)
            }
        })
    
    movingPiece = selectedPiece
        
    //end of function, next step initiates onclick with selectMove() or jump()
}
    
function selectMove (option) {
    console.log("selectMove")
    let divId = `(${movingPiece.position.x}, ${movingPiece.position.y})`
    const divLocation = document.getElementById(divId)
    divLocation.removeChild(divLocation.firstChild)
    divId = option //this will be used to index the gamepiece in the gamestate
    gamestate[movingPiece.position.y].splice(movingPiece.position.x, 1, "");
    movingPiece.position.x = parseInt(divId[1])
    movingPiece.position.y = parseInt(divId[4])   
    gamestate[movingPiece.position.y].splice(movingPiece.position.x, 1, movingPiece);
 
    setPieceToBoard(movingPiece)
    cleanUp()
    turnEnd()
}
    
function jump (option) {
    console.log("jump")
    let divId = `(${movingPiece.position.x}, ${movingPiece.position.y})`
    //move game piece to the target div
    let divLocation = document.getElementById(divId)
    divLocation.removeChild(divLocation.firstChild)
    //removes the token from the original div and prepares to insert it at the target div
        
    //following code finds the piece that was just jumped   
        let threatenedPiece = {position: {
            x: movingPiece.position.x,
            y: movingPiece.position.y,
            }}
        let tempPiece = {position: {
            x: parseInt(option[1]),
            y: parseInt(option[4])
        }}
        
    
        if (threatenedPiece.position.y > tempPiece.position.y) {
            threatenedPiece.position.y = threatenedPiece.position.y-1
        } else {
            threatenedPiece.position.y = threatenedPiece.position.y+1
        }
    
        if (threatenedPiece.position.x > tempPiece.position.x) {
            threatenedPiece.position.x = threatenedPiece.position.x-1
        } else {
            threatenedPiece.position.x = threatenedPiece.position.x+1
        }

        threatenedPiece = gamestate[threatenedPiece.position.y][threatenedPiece.position.x]
    //Finds the jumped piece by locattion and creates it from the gameState index
        
    divId = option //this will be used to index the gamepiece in the gamestate
    gamestate[movingPiece.position.y].splice(movingPiece.position.x, 1, "");
    movingPiece.position.x = parseInt(divId[1])
    movingPiece.position.y = parseInt(divId[4])
    gamestate[movingPiece.position.y].splice(movingPiece.position.x, 1, movingPiece);
    //removes the object representing the piece from its current location in gamestate
    //then modifies its position values and reinserts it into the gamestate at its new pos
    setPieceToBoard(movingPiece)
        
    divId =`(${threatenedPiece.position.x}, ${threatenedPiece.position.y})`
    divLocation = document.getElementById(divId)
    divLocation.removeChild(divLocation.firstChild)
    //removes the captured piece
        
    //captured Piece updates
    gamestate[threatenedPiece.position.y][threatenedPiece.position.x] = ""
    
    switch (threatenedPiece.color) {
        case "Red": 
            for (i = 0; i < piecesRed.length; i++) {
                if (piecesRed[i].id === threatenedPiece.id) {
                    piecesRed[i].captured = true
                    piecesRed[i].position = {x: null, y: null}
                    capturedRed.push(piecesRed[i])
                    piecesRed.splice(i, 1)                        
                } 
            };
        case "Blue":
            for (i = 0; i < piecesBlue.length; i++) {
                if (piecesBlue[i].id === threatenedPiece.id) {
                    piecesBlue[i].captured = true
                    piecesBlue[i].position = {x: null, y: null}
                    capturedBlue.push(piecesBlue[i])
                    piecesBlue.splice(i, 1)            
                }
            }
    }
          
    movingPiece.jumping = true
    jumpCleanup()
    moveFinder(movingPiece) 
    //loops back through the capturing rules, but the logic gates certain actions while movingPiece.jumping = true
}

function turnEnd() {
    console.log(playersArr)
    
    if (piecesRed.length === 0) {
        player1.lose = true
    }

    if (piecesBlue.length === 0) {
        player2.lose = true
    }

    playersArr.forEach(player => {
        player.loser()
        if (player.lose === true) {
            gameEnd();
        }
    })
    
    playersArr.forEach(player => {
        if (player.turn === true) {
            player.turn = false    
        } else {
            player.turn = true
        }
    })
    turnStart();
}

function gameEnd() {
    playersArr.forEach(player => {
        if (player.lose === false) {
            //alert (player.name + " wins :)")
            document.querySelector(".results").innerHTML = `${player.color} player wins! :)`
        }
    })
    
}