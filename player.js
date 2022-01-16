//Player Class
class Player{
    constructor(name){
        this.name = name;
    }
}

class Room{
    constructor(id){
        this.id = id;
        this.players = {};
    }
}