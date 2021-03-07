'use strict'
import {
    serverOperation
}
from '/js/XHHTP_CLASS.js'
import {
    config
} from '/config/config.js'
module.export = class newUser {
    constructor(nickname, colors) {
        this.nickname = nickname
        this.colors = colors || new Array(3).map(element => Math.floor(Math.random() * 255))
    }

    //methods 
    findRoom() {
        let askForRoom = new serverOperation("POST", {
            nick: this.nick,
            colors: this.colors
        },)

    }
}