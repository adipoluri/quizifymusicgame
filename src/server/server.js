const express = require('express');
const app = express();
const port = 3000;
const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5500",
    methods: ["GET", "POST"]
  }
});

server.listen(port, () => {
  console.log('Listen on port 3000');
});

//Data structure for players
let rooms = {};
let players = {};

io.on('connection',connected);

//Hello World line taken from the express website
app.get('/', (req, res) => {
  res.send('Hello World!')
})

//The 'connection' is a reserved event name in socket.io
//For whenever a connection is established between the server and a client
function connected(socket){
  socket.on('disconnect', function(){
      delete rooms[players[socket.id].lobby].players[socket.id];
      delete players[socket.id];
      console.log("Goodbye client with id "+ socket.id);
      console.log("Current number of players: "+ Object.keys(players).length);
      for(let room in rooms){
        io.to(room).emit('updatePlayers', rooms[roomID].players);
      }
  });

  socket.on('CreateRoom', () => {
    newRoomID = makeRoomId();
    rooms[newRoomID] = new Room(newRoomID);
    console.log("Room created: " + newRoomID);
    io.to(socket.id).emit('createdRoomSuccess', newRoomID);
  })

  socket.on('JoinRoomWithCode', data => {
    for(let roomID in rooms){
      if(roomID == data.roomID){
        currentLobby =  rooms[roomID]
        console.log("New client connected to Lobby, with id: "+ socket.id);
        currentLobby.players[socket.id] = new Player(data.name, roomID);
        players[socket.id] = currentLobby.players[socket.id];
        console.log("Current number of players in Lobby: "+ Object.keys(currentLobby.players).length);
        console.log("players dictionary: ", currentLobby.players);
        socket.join(data);
        io.to(roomID).emit('updatePlayers', currentLobby.players);    
      }
    }
  });
}


function makeRoomId() {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var charactersLength = characters.length;
  do {
    for ( var i = 0; i < 5; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  }
  while(rooms[result] != undefined); 

  return result;
}

//Room Class
class Room{
  constructor(id){
      this.id = id;
      this.players = {};
  }
}

//Player Class
class Player{
  constructor(name, lobby){
      this.name = name;
      this.lobby = lobby;
  }
}
