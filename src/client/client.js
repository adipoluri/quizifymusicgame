// NET CODE //
//Establishing a connection with the server on port 5500y
const socket = io('http://localhost:3000');

let clientPlayers = {};

const creatRoomButton = document.getElementById('createRoomButton');
const nameInput = document.getElementById('playerName');
const submitRoomCodeButton = document.getElementById('submitRoomCode');
const roomCodeInput = document.getElementById('roomCodeInput');

//Joining lobby for game
creatRoomButton.addEventListener('click', () => {
    document.getElementById('home').style.display = "none"
    document.getElementById('testdiv').style.display = "block"
    socket.emit('CreateRoom', {});
});

socket.on('createdRoomSuccess', roomID => {
    let name = nameInput.value
    if(name == 'Guest'){
        name = 'Guest' + Math.floor(Math.random() * 1000);
    }
    socket.emit('JoinRoomWithCode', {"roomID": roomID, "name": name});
})

submitRoomCodeButton.addEventListener('click', () => {
    let name = nameInput.value
    if(name == 'Guest'){
        name = 'Guest' + Math.floor(Math.random() * 1000);
    }
    socket.emit('JoinRoomWithCode', {"roomID": roomCodeInput.value, "name": name});
});

socket.on('joinedRoomSuccess', roomID => {
    //CHANGE HTML PAGE
})

//Callback function fires on the event called 'serverToClient'
socket.on('updatePlayers', players => {
    playersFound = {};
    for(let id in players) {
        if(clientPlayers[id] === undefined && id !== socket.id){
            clientPlayers[id] = new Player(players[id].name);
        }
        playersFound[id] = true;
    }
    for(let id in clientPlayers){
        if(!playersFound[id]){
            clientPlayers[id].remove();
            delete clientPlayers[id];
        }
    }
})
