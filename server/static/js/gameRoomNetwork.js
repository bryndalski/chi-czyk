'use strict'
import {
    createGameBord,
    // pozycjePodstawowe,
    // gamePRCT,
    // domki
}
from '/js/gameRoom.js'

import {
    serverOperation
}
from '/js/XHHTP_CLASS.js'

import {
    config
}
from '/config/config.js'

import Dice from './dice.js'


window.addEventListener('DOMContentLoaded', async () => {
    createGameBord.setCanvas()
    const _this = userInGameOperations
    let statusik = new serverOperation(null, null, config.getUsers) // tworzę nowe zapytanie
    await statusik.fetchData().then(value => { //pobieram zapytanie z serwera 
        _this.userArray = value.players // dodaję wszystkich użtykowników 
        _this.userArray = value.players //dodaję tablice gra
        _this.whoAmI = value.whoAmI.nickname // zapisuje nickname
        /// tworzę karty użytkowników
        _this.userArray.forEach((element, counter) => {
            _this.createUser(element) // tworzę "kartę " użytkownika 
        })
    })
    //pobiera całą planszę bez niczego
    _this.createBord()
    //nanoszę na nią współrzędne punktów aktualnych 
    _this.createPawns()
    _this.synchGame()
    _this.kosteczka = new Dice()
})
window.addEventListener("resize", () => {
    createGameBord.resize() // skaluję canvas 
})



const userInGameOperations = {
    serverResponse: {},
    userArray: [],
    playerOperationArray: [],
    whoAmI: null,
    kosteczka: null,
    //tworzneie karty użytkownika 
    createUser(user) {
        let userTemplate = document.querySelector('template').cloneNode(true)
        let userTemplatContainer = userTemplate.content.children[0]
        userTemplatContainer.style.borderColor = `rgb(${user.R},${user.G},${user.B})` //Border żeby wiadomo było kto jaki kolor 
        userTemplatContainer.querySelector('h3').style.color = `rgb(${user.R},${user.G},${user.B})` //Border żeby wiadomo było kto jaki kolor 
        let nick = document.createTextNode(user.nickname)
        userTemplatContainer.querySelector('h3').appendChild(nick)
        document.querySelector('.players').appendChild(userTemplate.content) //Daje do containera
        this.playerOperationArray.push(new Player(user.nickname, (`rgb(${user.R},${user.G},${user.B})`), userTemplatContainer, userTemplatContainer.querySelector('span'), userTemplatContainer.querySelector("button"), this.whoAmI))
    },
    //zarządzanie planszą 
    createBord() { // pobieranie danych "czystej" planszy oraz odpowiedzialność za jej możliwy resize
        let statusik = new serverOperation(null, null, config.getBord)
        statusik.fetchData().then(v => {
            createGameBord.cordsArray = v
            createGameBord.resize()
        })
    },
    createPawns() { //pobiera pozycje pionków 
        let statusik = new serverOperation(null, null, config.getPawns)
        statusik.fetchData().then(v => {
            createGameBord.pawnsArray = v
            createGameBord.resize()
        })
    },
    //zarządzanie ruchem 
    synchGame() {
        //pobierani informacji o kolejce 
        let synch = new serverOperation(null, null, config.gameSynch, null)
        synch.fetchData().then((v) => {
            this.playerOperationArray.forEach(index => index.enebleDice(this.playerOperationArray[v.movePlayer].getNick, v.dice))
            //obliczam czas do nastepnego zapytania 
            /* 
            Ponieważ zależy mi na regularnej synchronizacji z serwerem co sekunde ściągam czas z serwera
            podczas requestu. Aż się prosi i błaga o socety ale nie można :( więc trzeba lecieć prwoizorke
            */
            this.kosteczka.setDice(v.dice)
            this.playerOperationArray[v.movePlayer].setTime(v.remainingTime)
            let nextRequest = v.reqSendTime + 500 - new Date().getTime()
            if (nextRequest < 0) nextRequest = 0
            if (nextRequest <= 0)
                nextRequest = 0
            setTimeout(function () {
                userInGameOperations.synchGame()
            }, nextRequest)
        })
    }


}

class Player {
    constructor(nickname, color, connectedDiv, timer, button, gameOwner) {
        this.gameOwner = gameOwner
        this.nickname = nickname
        this.color = color
        this.connectedDiv = connectedDiv
        this.timer = timer
        this.button = button
        this.pawnsOnbord = {}
        this.pawnsOnSpawn = 4
        this.countDownInterval = null
        this.dice = null
        this.initiate()
    }
    initiate() {
        this.dice = new Dice()
        console.log(this.dice);
    }
    //getters 
    get getNick() {
        return this.nickname
    }

    //methods
    //DICE
    enebleDice(who, diceValue) {
        if (this.nickname == who && this.nickname == this.gameOwner && diceValue == null) {
            this.button.style.visibility = "visible"
            this.timer.style.visibility = "visible"
            this.button.style.borderColor = this.color
            this.button.addEventListener('click', this.throwDice)
        } else {
            this.button.style.visibility = "hidden"
            this.timer.style.visibility = "hidden"
            this.button.addEventListener('click', this.throwDice)
        }
    }
    disableDice() {
        this.button.style.visibility = "hidden"
        this.button.removeEventListener('click', this.throwDice)
    }
    throwDice = () => {
        this.dice.throwDice()
        this.disableDice()
    }
    setTime(time) {
        this.timer.style.visibility = "visible"
        this.timer.innerText = time
        if (time == 0) {
            this.button.style.visibility = "hidden"
            this.timer.style.visibility = "hidden"
        }
    }




    //podpowiedzi
    blinkBase() {
        this.domki.forEach(index => {
            createGameBord
        })
    }
}