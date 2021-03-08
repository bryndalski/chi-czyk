'use strict'
class NewUserInRoom {
    constructor(userFromServer) {
        this.userFromServer = userFromServer
        clickableContent = {}
    }

    //methods 
    createUserBlock() {
        let userTemplate = document.querySelector('template')
        document.body.appendChild(userTemplate)
    }
    userWantsToPlay() {

    }

}
module.exports = {
    NewUserInRoom
}