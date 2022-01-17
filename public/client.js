// NET CODE //
//Establishing a connection with the server on port 5500y
const socket = io.connect();



//data structures
let clientPlayers = {};
let Username = "";
let questionData = {};

//State variables
let inLobby = false;
let inGame = false;
let notGuessed = true;

//LANDING PAGE CODE
const creatRoomButton = document.getElementById('createRoomButton');
const nameInput = document.getElementById('playerName');
const submitRoomCodeButton = document.getElementById('submitRoomCode');
const roomCodeInput = document.getElementById('roomCodeInput');
const joinRoomButton = document.getElementById('joinRoomButton');

function showHideRoomCode(){
    document.getElementById('inputBox').style.display = "block";
}

function alertBoxExit(){
    if(confirm("Are you sure you want to exit?") == true){
        location.replace("index.html");
    }
}

joinRoomButton.addEventListener('click', () => {
    showHideRoomCode();
});


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
    document.getElementById('endDiv').style.display = "none"
    document.getElementById('joinCode').innerHTML = "The Join Code is: " + roomID;
    inLobby = true;
    inGame = false;
})


//Callback function fires on the event called 'uodatePlayers'
socket.on('updatePlayers', players => {

    let playersFound = {};
    for(let id in players) {
        if(clientPlayers[id] === undefined){
            clientPlayers[id] = new Player(players[id].name, players[id].score);
        } else {
            clientPlayers[id].score = players[id].score;
        }
        playersFound[id] = true;
    }

    for(let id in clientPlayers){
        if(!playersFound[id]){
            delete clientPlayers[id];
        }
    }
    console.log(clientPlayers);
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
    document.getElementById('endDiv').style.display = "none"
    inLobby = false;
    inGame = true;
})

function updateLobby() {

    let counter = 0;
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
    if(notGuessed){
        if(questionData['answer'] == button1.textContent){
            socket.emit('addScore', document.getElementById('counter').innerHTML);
            swal({
                icon: "success",
              });
        } else {
            swal("Wrong!, the correct answer is " + questionData['answer'], {
                icon: 'error',
            });
        }
    }
    notGuessed = false;

});

const button2 = document.getElementById('button2');
button2.addEventListener('click', () => {
    if(notGuessed){
        if(questionData['answer'] == button2.textContent){
            socket.emit('addScore', document.getElementById('counter').innerHTML);
            swal({
                icon: "success",
              });
        } else {
            swal("Wrong!, the correct answer is " + questionData['answer'], {
                icon: 'error',
            });
        }
    }    
    notGuessed = false;

});

const button3 = document.getElementById('button3');
button3.addEventListener('click', () => {
    if(notGuessed){
        if(questionData['answer'] == button3.textContent){
            socket.emit('addScore', document.getElementById('counter').innerHTML);
            swal({
                icon: "success",
              });
        } else {
            swal("Wrong!, the correct answer is " + questionData['answer'], {
                icon: 'error',
            });
        }
    }   
    notGuessed = false;

});

const button4 = document.getElementById('button4');
button4.addEventListener('click', () => {
    if(notGuessed){
        if(questionData['answer'] == button4.textContent){
            socket.emit('addScore', document.getElementById('counter').innerHTML);
            swal({
                icon: "success",
              });
        } else {
            swal("Wrong!, the correct answer is " + questionData['answer'], {
                icon: 'error',
            });
        }
    }    
    notGuessed = false;

});


function updateGame() {
    let index = 0; 
    for(let id in clientPlayers) {
        document.getElementById('scoreboard' + index).style.display = "block";
        document.getElementById('playerName' + index).innerHTML = clientPlayers[id].name;
        document.getElementById('playerScore' + index).innerHTML = clientPlayers[id].score;
        index += 1;
        console.log(clientPlayers[id].score)
    }
    for(let i = index; i < 8; i++) {
        document.getElementById('scoreboard' + i).style.display = "none";
        index += 1;
    }

}



socket.on('counter', counter => {
    document.getElementById('counter').innerHTML = counter + 's Left!';
})



socket.on('nextRound', (data) => {
    questionData = data
    notGuessed = true;
    console.log(data)
    document.getElementById("spotify").src = "https://open.spotify.com/embed/track/" + data['songURI'] + "?utm_source=generator&theme=0"
    document.getElementById("questionText").innerHTML = data['question'];
    
    let randomVal = Math.floor(Math.random() * 4 + 1);
    let counter = 1;
    for(let x = 1; x < 5; x++){
        if(x==randomVal) {
            document.querySelector("#button" + x).innerHTML  = data['answer'];
        } else {
            document.querySelector("#button" + x).innerHTML  = data['alt' + counter];
            counter += 1;
        }
    }
})



socket.on('EndGame', roomID => {
    document.getElementById('home').style.display = "none"
    document.getElementById('lobbyDiv').style.display = "none"
    document.getElementById('gameDiv').style.display = "none"
    document.getElementById('endDiv').style.display = "block"
    inLobby = false;
    inGame = false;

    max = 0;
    maxPlayer = "";
    for(let player in clientPlayers){
        if(clientPlayers[player].score > max){
            max = clientPlayers[player].score;
            maxPlayer = player;
        }
    }
    document.getElementById('player0').style.display = "block";
    document.getElementById('pl1').innerHTML = clientPlayers[maxPlayer].name;
    document.getElementById('score1').innerHTML = max

    
})

socket.on('goToLobby', roomID => {
    document.getElementById('home').style.display = "none"
    document.getElementById('lobbyDiv').style.display = "block"
    document.getElementById('gameDiv').style.display = "none"
    document.getElementById('endDiv').style.display = "none"
    inLobby = true;
    inGame = false;
})


//END GAME CODE

