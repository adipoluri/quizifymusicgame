const express = require('express');
const app = express();
const port = 3000;
const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5500",
  }
});

server.listen(port, () => {
  console.log('Listen on port 3000');
});

//Data structure for players
let rooms = {};

io.on('connection',connected);

//Hello World line taken from the express website
app.get('/', (req, res) => {
  res.send('Hello World!')
})

//The 'connection' is a reserved event name in socket.io
//For whenever a connection is established between the server and a client
function connected(socket){
  socket.on('disconnect', function(){
      delete players[socket.id];
      console.log("Goodbye client with id "+ socket.id);
      console.log("Current number of players: "+Object.keys(players).length);
      io.emit('updatePlayers', players);
  });

  socket.on('CreateRoom', () => {
    newRoomID = makeRoomId();
    rooms[newRoomID] = new Room(newRoomID);
    console.log("Room created: " + newRoomID);
    socket.emit('createdRoomSuccess', newRoomID);
  })

  socket.on('JoinRoomWithCode', data => {
    for(let roomID in rooms){
      if(roomID == data.roomID){
        currentLobby =  room[roomID]
        console.log("New client connected to Lobby, with id: "+ socket.id);
        currentLobby.players[socket.id] = data.name;
        console.log("Name: " + currentLobby.players[socket.id]);
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
  while(rooms.includes(result)); 

  return result;
}