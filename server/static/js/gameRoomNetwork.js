'use strict'
import {
    createGameBord,
    pozycjePodstawowe,
    gamePRCT,
    domki
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

window.addEventListener('DOMContentLoaded', () => {
    createGameBord.setCanvas()
    createGameBord.resize()
    createGameBord.drawGamePath()
    console.log(config);
    let serverRequest = new serverOperation(null, null, config.getUsers, null)
    serverRequest.fetchData().then(value => {
        userInGameOperations.userArray = value.players
        userInGameOperations.serverResponse = {
            ...value
        }
        createGameBord.userArray = value.players
        userInGameOperations.userArray.forEach(element => {
            userInGameOperations.createUser(element)
        });
        createGameBord.resize()
    })

})
window.addEventListener("resize", () => {
    createGameBord.resize()
})



const userInGameOperations = {
    serverResponse: {},
    userArray: [],

    beginGame() {
        console.log(this.userArray)

    },

    createUser(user) {
        let userTemplate = document.querySelector('template').cloneNode(true)
        let userTemplatContainer = userTemplate.content.children[0]

        userTemplatContainer.style.borderColor = `rgb(${user.R},${user.G},${user.B})` //Border żeby wiadomo było kto jaki kolor 
        userTemplatContainer.querySelector('h3').style.color = `rgb(${user.R},${user.G},${user.B})` //Border żeby wiadomo było kto jaki kolor 

        let nick = document.createTextNode(user.nickname)
        userTemplatContainer.querySelector('h3').appendChild(nick)
        document.querySelector('.players').appendChild(userTemplate.content) //Daje do containera
    },
    throwDice() {
        let sum = Math.floor(Math.random() * 6)

    }


}