// NET CODE //

//Establishing a connection with the server on port 5500y
const socket = io('http://localhost:3000');

let clientPlayers = {};

//sending the initial positions to the server
socket.emit('newPlayer', "ligma");

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

socket.on('createRoomSuccess', roomID => {
    socket.emit('JoinRoomWithCode', {"roomID": roomID, "name": "ligma"});
})


let audio_iframe = document.querySelector('iframe');

widget = SC.Widget(audio_iframe);
widget.setVolume(0);