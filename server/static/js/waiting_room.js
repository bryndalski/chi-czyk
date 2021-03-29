'use strict'
import {
    serverOperation
}
from '/js/XHHTP_CLASS.js'
import {
    config
}
from '/config/config.js'
const newRoom = {
    userArray: [],
    userNumber: 0,
    roomId: window.localStorage.getItem("roomId") || null,
    relationInputNickname: {},
    async iWantToPlay(e) {
        console.log(e.target.checked);
        e.target.disabled = true
        new serverOperation(null, {
            change: e.target.checked
        }, config.changePlay, null).sendData().then((val) => {
            console.log(val);
            e.target.disabled = false
        })
    },
    createUser(user, whoAmI, whoWantsToPlay) {
        let userTemplate = document.querySelector('template').cloneNode(true)
        let userTemplatContainer = userTemplate.content.children[0]

        userTemplatContainer.style.borderColor = `rgb(${user.R},${user.G},${user.B})` //Border żeby wiadomo było kto jaki kolor 
        let nick = document.createTextNode(user.nickname)
        userTemplatContainer.querySelector('h3').appendChild(nick)

        if (user.nickname === whoAmI.nickname) {
            userTemplatContainer.querySelector('input').disabled = false // Zezwolenie na edycje inputu właściciela 
            userTemplatContainer.querySelector('input').addEventListener('change', this.iWantToPlay)
        }

        if (whoWantsToPlay.includes(user.nickname)) //jeśli chce grać dostaje już zaznaczony
            userTemplatContainer.querySelector('input').checked = true

        this.relationInputNickname[user.nickname] = { //
            input: userTemplatContainer.querySelector('input'), // Relacja między inputami i kto gra 
            wantsToPlay: whoWantsToPlay.includes(user.nickname) //
        }

        document.querySelector('.pudelko').appendChild(userTemplate.content) //Daje do containera
    },

    async fetchUsers() {
        let findMe = await new Promise(async (success, er) => {
            let roomUsers = new serverOperation(null, null, config.fetchWaitingRoom, null)
            let respond = await roomUsers.fetchData()
            if (await respond.players.length !== this.userArray.length) { //Sprawdza czy został dodany nowy użytkownik żeby nie renderować na nowo
                respond.players.forEach((index, counter) => {
                    if (JSON.stringify(index) !== JSON.stringify(this.userArray[counter]))
                        this.createUser(index, respond.whoAmI, respond.whoWantsToPlay)
                })
                this.userArray = respond.players
            }
            //sprawdzam kto chce grać 
            if (await respond.whoWantsToPlay != []) //bez sensu mielić pętle jak nikt nie chce grać
                Object.keys(this.relationInputNickname).forEach((element, counter) => {
                    this.relationInputNickname[element].wantsToPlay = (respond.whoWantsToPlay.includes(element)) ? true : false //obie obdpowiedzi takie same jeśli gra to gra a jeśli element != temu to  nie gra proste szybkie 
                    this.relationInputNickname[element].input.checked = (respond.whoWantsToPlay.includes(element)) ? true : false
                })
            if (respond.whoWantsToPlay.length >= 2 || this.userArray.length == 4)
                newRoom.sychAndStart(await respond)
            else
                success(await respond)
        })
        return findMe
    },

    sychAndStart(respond) {
        console.log("synchronizuję");
        console.log(respond.synchTime);
        let timeoutCount = respond.synchTime - new Date().getTime()
        setTimeout(() => {
            window.location.href = "/chinaGameplay"
        }, timeoutCount);
    },
    startFetching() {
        newRoom.fetchUsers().then(v => setTimeout(() => {
            this.startFetching()
        }, 3000))
    }
}


window.addEventListener('DOMContentLoaded', () => {
    newRoom.startFetching()
})