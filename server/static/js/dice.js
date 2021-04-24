"use strict";
import { serverOperation } from "/js/XHHTP_CLASS.js";
import { config } from "/config/config.js";

class Dice {
  constructor(dice) {
    this.diceContainer = document.querySelector(".diceContainer");
    this.diceNumber = null;
    this.letMeTalk = true;
    this.syntezatorek = window.speechSynthesis;
  }
  //getters

  //methods

  throwDice() {
    let kosteczka = new serverOperation(null, null, config.dice, null);
    kosteczka.fetchData();
  }
  clearDice() {
    this.diceContainer.src = "/images/question.svg";
    this.letMeTalk = true;
  }
  setDice(value) {
    if (value != null) {
      this.diceContainer.src = `/images/dice-${value}.svg`;
      if (this.letMeTalk) {
        //TODO odkomentuj
        let utterance = new SpeechSynthesisUtterance(` ${value}`);
        this.letMeTalk = false;
        utterance.lang = "pl-PL";
        this.syntezatorek.speak(utterance);
      }
    } else this.clearDice();
  }
}
export default Dice;
