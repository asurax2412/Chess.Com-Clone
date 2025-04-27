# Chess.com Clone

A real-time multiplayer chess game built with Node.js, Express, Socket.io, chess.js, and EJS. This project allows two players to play chess in real time, with additional users able to join as spectators. The frontend is styled with Tailwind CSS and custom CSS, and the chess logic is powered by the chess.js library.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Architecture Overview](#architecture-overview)
- [Frontend Flow](#frontend-flow)
- [Backend Flow](#backend-flow)
- [Setup & Usage](#setup--usage)
- [Credits](#credits)

---

## Features

- Real-time chess gameplay using WebSockets (Socket.io)
- Drag-and-drop chess pieces
- Automatic board flipping for black player
- Spectator mode for additional users
- Unicode chess pieces for cross-platform compatibility
- Responsive and modern UI

---

## Project Structure

```
Chess/
├── app.js
├── package.json
├── public/
│   ├── css/
│   └── js/
│       └── chessgame.js
├── views/
│   └── index.ejs
└── README.md
Resource/
├── backendSetup.yaml
├── frontendSetup.yaml
└── ...
```

---

## How It Works

### 1. Player Connection

- When a user connects, the server assigns them as white, black, or spectator based on availability.
- The chessboard is rendered dynamically in the browser.
- Players can drag and drop pieces to make moves. Only valid moves are accepted.
- Moves are sent to the server, validated, and broadcast to all clients.
- The board automatically updates for all players and spectators in real time.
- The board flips for the black player for a realistic experience.

### 2. Game Logic

- The chess logic (move validation, turn management, FEN serialization) is handled by [chess.js](https://github.com/jhlywa/chess.js).
- The frontend listens for events from the server and updates the board accordingly.

---

## Architecture Overview

**How the system works:**

- Each client (player or spectator) connects to the Node.js server using Socket.io.
- The server assigns roles (white, black, or spectator) and manages the game state using chess.js.
- When a player makes a move, it is sent to the server, validated, and then broadcast to all clients.
- The frontend updates the board in real time for all connected users.

```
+----------------+         WebSocket         +-------------------+
|  Player White  | <----------------------> |                   |
+----------------+                          |                   |
                                            |                   |
+----------------+         WebSocket         |                   |
|  Player Black  | <----------------------> |   Node.js Server  |
+----------------+                          |    (Express,      |
                                            |    Socket.io,     |
+----------------+         WebSocket         |    chess.js)      |
|  Spectator(s)  | <----------------------> |                   |
+----------------+                          |                   |
                                            +-------------------+
```

---

## Frontend Flow

**Step-by-step process:**

1. User opens the browser and connects to the server via Socket.io.
2. The server assigns a role (white, black, or spectator).
3. The initial board is rendered.
4. If the user is a player, they can drag and drop pieces to make moves.
5. The move is sent to the server for validation.
6. If valid, the server broadcasts the move to all clients.
7. All clients update their boards in real time.

---

## Backend Flow

**Step-by-step process:**

1. Client connects to the server.
2. Server assigns a role (white, black, or spectator).
3. Server sends the initial board state.
4. Server listens for move events from players.
5. Server validates the move using chess.js.
6. If valid, the server updates the game state and broadcasts the move.
7. If invalid, the server notifies the client.
8. Server handles disconnects and updates player slots.

---

## Setup & Usage

1. **Clone the repository**
    ```sh
    git clone https://github.com/yourusername/chess-com-clone.git
    cd chess-com-clone/Chess
    ```

2. **Install dependencies**
    ```sh
    npm install
    ```

3. **Run the server**
    ```sh
    node app.js
    ```

4. **Open your browser**
    - Visit `http://localhost:5000`
    - Open the link in two tabs/windows to play as both white and black, or share the link for multiplayer.

---

## Credits

- [chess.js](https://github.com/jhlywa/chess.js) for chess logic
- [Socket.io](https://socket.io/) for real-time communication
- [Tailwind CSS](https://tailwindcss.com/) for styling
- Unicode Chess Symbols

---

*This project is for educational purposes and is not affiliated with Chess.com.*