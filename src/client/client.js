// NET CODE //
//Establishing a connection with the server on port 5500y
const socket = io('http://localhost:3000');



//data structures
let clientPlayers = {};
let Username = "";

//State variables
let inLobby = false;
let inGame = false;

//LANDING PAGE CODE
const creatRoomButton = document.getElementById('createRoomButton');
const nameInput = document.getElementById('playerName');
const submitRoomCodeButton = document.getElementById('submitRoomCode');
const roomCodeInput = document.getElementById('roomCodeInput');


//LOBBY JOINING CODE
creatRoomButton.addEventListener('click', () => {
    socket.emit('CreateRoom', {});
});

socket.on('createdRoomSuccess', roomID => {
    let name = nameInput.value
    if(name == ''){
        name = 'Guest' + Math.floor(Math.random() * 1000);
    }
    socket.emit('JoinRoomWithCode', {"roomID": roomID, "name": name});
})

submitRoomCodeButton.addEventListener('click', () => {
    let name = nameInput.value
    if(name == ''){
        name = 'Guest' + Math.floor(Math.random() * 1000);
    }
    socket.emit('JoinRoomWithCode', {"roomID": roomCodeInput.value, "name": name});
});

socket.on('joinedRoomSuccess', roomID => {
    document.getElementById('home').style.display = "none"
    document.getElementById('lobbyDiv').style.display = "block"
    document.getElementById('gameDiv').style.display = "none"
    document.getElementById('joinCode').innerHTML = "The Join Code is: " + roomID;
    inLobby = true;
    inGame = false;
})


//Callback function fires on the event called 'uodatePlayers'
socket.on('updatePlayers', players => {
    playersFound = {};
    for(let id in players) {
        if(clientPlayers[id] === undefined){
            clientPlayers[id] = new Player(players[id].name, players[id].score);
        }
        playersFound[id] = true;
    }

    for(let id in clientPlayers){
        if(!playersFound[id]){
            delete clientPlayers[id];
        }
    }

    console.log(clientPlayers)
    if(inLobby){
        updateLobby();
    }
    if(inGame){
        updateGame();
    }
})


//LOBBY CODE
const startGameButton = document.getElementById('startGameButton');
startGameButton.addEventListener('click', () => {
    socket.emit('startGame', {});
});

socket.on('gameStartedSuccess', roomID => {
    document.getElementById('home').style.display = "none"
    document.getElementById('lobbyDiv').style.display = "none"
    document.getElementById('gameDiv').style.display = "block"
    inLobby = false;
    inGame = true;
})

function updateLobby() {

    counter = 0;
    for(let id in clientPlayers) {
        document.getElementById('p' + counter).style.display = "block";
        document.getElementById('p' + counter + "_name").innerHTML = clientPlayers[id].name;
        counter++;
    }
    for(let i = counter; i < 8; i++) {
        document.getElementById('p' + i).style.display = "none";
        counter++;
    }
}


//GAME CODE



const button1 = document.getElementById('button1');
button1.addEventListener('click', () => {
    alert("HAMING")
});

function updateGame() {
    counter = 0;
    for(let id in clientPlayers) {
        document.getElementById('scoreboard' + counter).style.display = "block";
        document.getElementById('playerName' + counter).innerHTML = clientPlayers[id].name;
        document.getElementById('playerScore' + counter).innerHTML = clientPlayers[id].score + " points";
        counter++;
    }
    for(let i = counter; i < 8; i++) {
        document.getElementById('scoreboard' + i).style.display = "none";
        counter++;
    }
}

