const express = require('express');
const socket = require('socket.io');
const http = require('http');
const path = require('path');
const { Chess } = require('chess.js');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { createServer } = require('http');
const { title } = require('process');


const app = express();
const server = http.createServer(app);

const io = socket(server);
const chess = new Chess();


let players = {};
let currenPLayer = "W";


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index',{title: 'Chess Game'});
});

io.on('connection', (uniquesocket) => {
    console.log('New connection:', uniquesocket.id);

    if(!players.white)
    {
        players.white = uniquesocket.id;
        uniquesocket.emit('playerRole', 'w');
    }else if(!players.black){
        players.black = uniquesocket.id;
        uniquesocket.emit('playerRole', 'b');
    }
    else{
        uniquesocket.emit('spectatorRole');
    }

    uniquesocket.on("disconnect", () => {
        console.log("User disconnected:", uniquesocket.id);
        if(uniquesocket.id === players.white) {
            delete players.white;
        }
        else if(uniquesocket.id === players.black) {
            delete players.black;
        }
    });

    
    uniquesocket.on("move", (move) => {
        try{
            if(chess.turn() === 'w' && uniquesocket.id !== players.white) return ;
            if(chess.turn() === 'b' && uniquesocket.id !== players.black) return ;

            const result = chess.move(move);
            if(result) {
                currenPLayer = chess.turn() === 'w' ? 'B' : 'W';
                io.emit('move', move);
                //fen() method is used to obtain the Forsyth-Edwards Notation (FEN) string representation of a chess board position. FEN is a standard notation for describing a specific board state, allowing you to restart a game from a particular poin
                io.emit('boardState', chess.fen());

            }else{
                console.log("Invalid move:", move);
                uniquesocket.emit('invalidMove', move);
            }

        }
        catch(err){
            console.log(err);
            console.log("Error in move:", move);
            uniquesocket.emit('invalidMove', move);
        }
    });
});



server.listen(5000, () => {
  console.log('Server is running on port 3000');
});