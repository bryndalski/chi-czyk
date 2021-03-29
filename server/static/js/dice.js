'use strict'
import {
    serverOperation
}
from '/js/XHHTP_CLASS.js'
import {
    config
}
from '/config/config.js'

class Dice {
    constructor(dice) {
        this.diceContainer = document.querySelector('.diceContainer')
    }
    //getters


    //methods

    throwDice() {
        let kosteczka = new serverOperation(null, null, config.dice, null, )
        kosteczka.fetchData().then((value) => {})
    }
    clearDice() {
        this.diceContainer.src = "/images/question.svg"
    }
    setDice(value) {
        if (value != null)
            this.diceContainer.src = `/images/dice-${value}.svg`
        else
            this.clearDice()
    }
}
export default Dice;