const app = Vue.createApp({
    data(){
        return {
            message: 'Test',
            Adi: 'https://media.discordapp.net/attachments/274745789690019841/932010360725180486/88954D67-6904-4D13-B76E-57594692FBFA.JPG?width=345&height=675'
        }
    },
})

app.mount('#app')


function showHideRoomCode(){
    document.getElementById('roomCodeInput').className="show";
    document.getElementById('submitRoomCode').className="show";
}