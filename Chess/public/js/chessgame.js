const socket = io()

const chess = new Chess()
const boardElement = document.querySelector('#boardElement')

let draggedPiece = null
let sourceSquare = null
let playerRole = 'W'
let gameOver = false


const renderBoard = () => {
    const board = chess.board();
    console.log(board);
    boardElement.innerHTML = "";
    board.forEach((row, rowIndex) => {
        row.forEach((square, squareindex) => {
            const squareElement = document.createElement('div')
            squareElement.classList.add('square',
                (rowIndex + squareindex) % 2 === 0 ? 'light' : 'dark'  
            );

            squareElement.dataset.row = rowIndex
            squareElement.dataset.col = squareindex

            if(square) {
                const pieceElement = document.createElement('div')
                pieceElement.classList.add('piece', square.color === 'w' ? 'white' : 'black')
                pieceElement.innerText = getPieceUnicode(square)
                pieceElement.draggable = playerRole === square.color;
                
                pieceElement.addEventListener('dragstart', (e) => {
                    if(pieceElement.draggable) {
                        draggedPiece = pieceElement
                        sourceSquare = {row: rowIndex, col: squareindex}
                        e.dataTransfer.setData('text/plain', '')
                    }
                });


                pieceElement.addEventListener('dragend', () => {
                    draggedPiece = null
                    sourceSquare = null
                });
                pieceElement.addEventListener('dragover', (e) => {
                    e.preventDefault()
                });

                squareElement.appendChild(pieceElement)
            }

            squareElement.addEventListener('dragenter', (e) => {
                e.preventDefault()
                if(draggedPiece && draggedPiece.draggable) {
                    squareElement.classList.add('highlight')
                }
            });
            squareElement.addEventListener('dragleave', () => {
                squareElement.classList.remove('highlight')
            });
            squareElement.addEventListener('dragover', (e) => {
                e.preventDefault()
            });  
            squareElement.addEventListener('drop', (e) => {
                e.preventDefault()
                if(draggedPiece && draggedPiece.draggable) {
                    const targetSquare = {
                        row: parseInt(squareElement.dataset.row),
                        col: parseInt(squareElement.dataset.col) 
                    }

                    handleMove(sourceSquare, targetSquare)
                }
            }); 

            boardElement.appendChild(squareElement)
        });

    });

    if(playerRole === 'b') {
        boardElement.classList.add('flipped')        
    } 
    else{
        boardElement.classList.remove('flipped')
    }  

};


const handleMove = (source,target) =>{
    const move = chess.move({
        from: `${String.fromCharCode(97+source.col)}${8- source.row}`,
        to: `${String.fromCharCode(97+target.col)}${8- target.row}`,
        promotion: 'q'
    });
    socket.emit('move', move);
    if(move === null) {
        socket.emit('invalidMove', move)
        console.log("Invalid move:", move);
    } else {
        renderBoard()
    }
};


const getPieceUnicode = (piece) => {
    const unicodePieces = {
        p: "♙",
        r: "♖",
        n: "♘",
        b: "♗",
        q: "♕",
        k: "♔",
        P: "♟",
        R: "♜",
        N: "♞",
        B: "♝",
        Q: "♛",
        K: "♚"
    };
    return unicodePieces[piece.type] || "";
};

socket.on('playerRole', (role) => {
    playerRole = role;
    renderBoard();
})

socket.on('spectatorRole', () => {
    playerRole = null;
    renderBoard();
})


socket.on('boardState', (fen) => {
    chess.load(fen);
    renderBoard();
})

socket.on('move', (move) => {
    chess.move(move);
    renderBoard();
})

socket.on('invalidMove', (move) => {
    console.log("Invalid move:", move);
})  

socket.on('gameOver', () => {
    gameOver = true;
    alert("Game Over!");
})


socket.on('gameDraw', () => {
    gameOver = true;
    alert("Game Draw!");
})

renderBoard();
