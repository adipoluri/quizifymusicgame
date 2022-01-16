const fs = require('fs');
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const request = require('request')

const app = express();
const port = process.env.PORT || 5500;
app.use(express.static('public'));
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5500",
    methods: ["GET", "POST"]
  }
});

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));


server.listen(port, () => {
  console.log('Listen on port 3000');
});

//Data structure for players
let rooms = {};
let players = {};
let data = getData();

io.on('connection',connected);

//Hello World line taken from the express website

//The 'connection' is a reserved event name in socket.io
//For whenever a connection is established between the server and a client
function connected(socket){
  socket.on('disconnect', function(){
      if(players[socket.id] != undefined){
        delete rooms[players[socket.id].lobby].players[socket.id];
        rooms[players[socket.id].lobby].playerCount -= 1;
      }
      delete players[socket.id];
      console.log("Goodbye client with id "+ socket.id);
      console.log("Current number of players: "+ Object.keys(players).length);

      for(let room in rooms){
        for(let player in rooms[room].players) {
          io.to(player).emit('updatePlayers', currentLobby.players);
        }
      }

      for(let room in rooms){
        if(rooms[room].playerCount == 0) {
          delete rooms[room];
        }
      }
      console.log(rooms);
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

        currentLobby = rooms[roomID]

        if(currentLobby.playerCount >= 8 || room[roomID].ingame){
          return;
        }
        
        currentLobby.players[socket.id] = new Player(data.name, roomID, 0);
        currentLobby.playerCount += 1;
        players[socket.id] = currentLobby.players[socket.id];
        
        console.log("New client connected to Lobby, with id: " + socket.id);
        console.log("Current number of players in Lobby: "+ Object.keys(currentLobby.players).length);
        console.log("players dictionary: ", currentLobby.players);

        socket.join(data);
        io.to(socket.id).emit('joinedRoomSuccess', newRoomID);
        
        for(let player in currentLobby.players) {
          io.to(player).emit('updatePlayers', currentLobby.players);
        }
      }
    }
  });

  socket.on('startGame', () => {
    console.log("Game Started");
    for(let player in rooms[players[socket.id].lobby].players) {
      io.to(player).emit('gameStartedSuccess', "LIGMA");
    }

    for(let player in rooms[players[socket.id].lobby].players) {
      io.to(player).emit('updatePlayers', currentLobby.players);
    }
    startGame(players[socket.id].lobby);
  });

  
  socket.on('addScore', () => {
 
    rooms[players[socket.id].lobby].players[socket.id].score += 1;
    for(let player in rooms[players[socket.id].lobby].players) {
      io.to(player).emit('updatePlayers', rooms[players[socket.id].lobby].players);
    }
  });


}

function startGame(id){
  
  var counter = 12;
  var rounds = 0;
  rooms[id].ingame = true;
  var WinnerCountdown = setInterval(function(){
    if(rooms[id] == undefined){
      return;
    }
    
    console.log(counter)

    for(let player in rooms[id].players) {
      io.to(player).emit('counter', counter);
    }

    if (counter === 12) {
      Qdata = getNextQuestionData();
      for(let player in rooms[id].players) {
        io.to(player).compress(false).emit('nextRound', Qdata);
      }
    } else if(counter === 0) {
      counter = 13;
      rounds += 1;
    }

    counter--;

    if (rounds ===  10) {
      clearInterval(WinnerCountdown);

      for(let player in rooms[id].players) {
        io.to(player).emit('EndGame', "LIGMA");
      }

      timeOut = setTimeout(function() {
        for(let player in rooms[id].players) {
          io.to(player).emit('goToLobby', "LIGMA");
        }
        for(let player in rooms[id].players) {
          io.to(player).emit('updatePlayers', rooms[id].players);
        }
        rooms[id].ingame = false;
      },10000);
  
    }
    
  }, 
  1000);
    
}



function getNextQuestionData(){
  let returnVal = {};
  songInd = Math.floor(Math.random() * data.length);
  song = data[songInd]
  returnVal['songURI'] = song['uri'].substring(14)

  questionType = Math.floor(Math.random() * 4);
  switch(questionType){
    case 0:
      returnVal['question'] = "What is the name of this song?";
      returnVal['answer'] = song['name'];

      for(let i = 1; i < 4; i++){
        newInt = Math.floor(Math.random() * data.length);
        returnVal['alt' + i] = data[newInt]['name'];
      }
      break;
    case 1:
      returnVal['question'] = "Who is the artist?";
      returnVal['answer'] = song['artist_name'];

      for(let i = 1; i < 4; i++){
        newInt = Math.floor(Math.random() * data.length);
        returnVal['alt' + i] = data[newInt]['artist_name'];
      }
      break;
    case 2:
      returnVal['question'] = "What album is this song from?";
      returnVal['answer'] = song['album'];

      for(let i = 1; i < 4; i++){
        newInt = Math.floor(Math.random() * data.length);
        returnVal['alt' + i] = data[newInt]['album'];
      }
      break;
    case 3:
      returnVal['question'] = "What is the average popularity score of this song?";
      returnVal['answer'] = song['popularity'];

      for(let i = 1; i < 4; i++){
        newInt = Math.floor(Math.random() * data.length);
        returnVal['alt' + i] = data[newInt]['popularity'];
      }
      break;
  }
  return returnVal;

}






/// Helper Functions


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
      this.playerCount = 0;
      this.ingame = false;
  }
}

//Player Class
class Player{
  constructor(name, lobby,score){
      this.name = name;
      this.lobby = lobby;
      this.score = score;
  }
}

//Obtain API Keys
function getData(){
    let rawdata = fs.readFileSync('songData.json');
    let apiKeys = JSON.parse(rawdata);
    return apiKeys;
}

