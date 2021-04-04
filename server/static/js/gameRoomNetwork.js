"use strict";
import { createGameBord } from "/js/gameRoom.js";

import { serverOperation } from "/js/XHHTP_CLASS.js";

import { config } from "/config/config.js";

import Dice from "./dice.js";

import Player from "./PLAYER.js";

window.addEventListener("DOMContentLoaded", async () => {
  createGameBord.setCanvas(); // ustawiam canvas
  userInGameOperations.kosteczka = new Dice(); // tworzę nową kostkę
  let statusik = new serverOperation(null, null, config.getUsers); // tworzę nowe zapytanie
  await statusik.fetchData().then((value) => {
    userInGameOperations.userArray = value.players; // dodaję wszystkich użtykowników
    createGameBord.users = value.players; // dodaję do obiektu tworzącego , tablice użytkowników
    userInGameOperations.whoAmI = value.whoAmI.nickname; // zapisuje nickname
    userInGameOperations.userArray.forEach((element) => {
      userInGameOperations.createUser(element); //tworzę karty użytkowników
    });
    userInGameOperations.createPawns();
    userInGameOperations.synchGame();
  });
});
window.addEventListener("resize", () => {
  createGameBord.resize(); // skaluję canvas
});

const userInGameOperations = {
  serverResponse: {}, // odpowiedź serwera
  userArray: [], // tablica użytkowników (KLASY)
  playerOperationArray: [],
  whoAmI: null, //informacja kim jestem
  kosteczka: null, // zawiera informacje o wylosowanych z póli kostkach
  myPawns: [], // przechowywuje informacje o wszystkich pionkach
  //tworzneie karty użytkownika
  createUser(user) {
    let userTemplate = document.querySelector("template").cloneNode(true);
    let userTemplatContainer = userTemplate.content.children[0];
    userTemplatContainer.style.borderColor = `rgb(${user.R},${user.G},${user.B})`; //Border żeby wiadomo było kto jaki kolor
    userTemplatContainer.querySelector(
      "h3"
    ).style.color = `rgb(${user.R},${user.G},${user.B})`; //Border żeby wiadomo było kto jaki kolor
    let nick = document.createTextNode(user.nickname);
    userTemplatContainer.querySelector("h3").appendChild(nick);
    document.querySelector(".players").appendChild(userTemplate.content); //Daje do containera
    this.playerOperationArray.push(
      new Player(
        user.nickname,
        `rgb(${user.R},${user.G},${user.B})`,
        userTemplatContainer,
        userTemplatContainer.querySelector("span"),
        userTemplatContainer.querySelector("button"),
        this.whoAmI
      )
    );
  },
  //zarządzanie planszą
  createPawns() {
    //pobiera pozycje pionków
    let statusik = new serverOperation(null, null, config.getPawns);
    statusik.fetchData().then((v) => {
      createGameBord.pawns = v;
      createGameBord.resize();
    });
  },
  //zarządzanie ruchem
  synchGame() {
    //pobierani informacji o kolejce
    let synch = new serverOperation(null, null, config.gameSynch, null);
    synch.fetchData().then((v) => {
      //odpalam kostki
      this.playerOperationArray.forEach((index) => {
        index.enebleDice(
          this.playerOperationArray[v.movePlayer].getNick,
          v.dice
        );
      });
      this.kosteczka.setDice(v.dice);
      //obliczam czas do nastepnego zapytania
      this.playerOperationArray[v.movePlayer].setTime(v.remainingTime);
      let nextRequest = v.reqSendTime + 2000 - new Date().getTime(); //TODO zmień na 1000 a nawet na 500 => mniej szybciej synchronizuje
      if (nextRequest < 0) nextRequest = 0;
      if (nextRequest <= 0) nextRequest = 0;
      setTimeout(function () {
        userInGameOperations.synchGame();
      }, nextRequest);
    });
    this.createPawns();
  },
  //przypisywanie pionków do użytkowników
  assignNewPawns(pawnsArray) {
    this.playerOperationArray.forEach((index) => {
      let wyniki = pawnsArray.map((item) => item.getOwner == index.getNick);
      console.log(wyniki);
    });
  },
};
export default userInGameOperations;
