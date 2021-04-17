"use stric";

const { json } = require("body-parser");
const { response } = require("express");
const e = require("express");
const { from } = require("responselike");
const wspolrzedne = require("./wspolrzedne");

module.exports = {
  //* inicjowanie użytkownika
  handleUserInit(req, database) {
    //towrzę osobę która zaczyna swoją gierkę
    //*Ustawiam bazę danych jako jedyną rzecz którą niezależnie od sesji i requestów s serwera swobodnie modyfikuję
    this.readDB(req, database).then((v) => {
      if (v.countDownInit) {
        // nadaję użytkownika od którego zależy rozpoczęcie wysyłania
        database.update(
          {
            //zapisuje do bazy danych
            _id: req.session.database._id,
          },
          {
            $set: {
              remainingTime: 60000,
              player: 0,
              countDownInit: req.session.whoAmI.nickname,
            },
          },
          {}, // this argument was missing
          (err, numReplaced) => {
            database.persistence.compactDatafile(); //czyści DB
          }
        );
      }
    });
    req.session.firstInit = true;
  },
  //? pobieranie informacji o pionkach
  getPawnPositions(req, database) {
    let toReturn = new Promise((suc, er) => {
      this.readDB(req, database).then((v) => {
        let pawnArray = []; // przechowywuje  obiety zawierające informacje o :
        //czytam bazę danych i ogarniam pozycje pionków
        v.players.forEach((element, counter) => {
          // dla każdego użytkownika
          v.pawnPositions[counter].forEach((index) => {
            pawnArray.push({
              x: index[0],
              y: index[1],
              //z playerów
              color: `rgb(${element.R},${element.G},${element.B})`,
              owner: element.nickname,
            });
          }); // odpowiednie pozycje pionków
        });
        suc(pawnArray); // uwalaniam tablice pionków
      });
    });
    return toReturn;
  },
  //*zarządzanie ruchami
  async handleGame(req, res, database) {
    //sprawdzam czy synchronizacja została wymuszona
    this.readDB(req, database).then((v) => {
      let wysyłam = {
        remainingTime: v.remainingTime / 1000, // czas w ludzkim formacie
        movePlayer: v.player, // rozgrywający
        reqSendTime: req.session.incoming, //do synchronizacji
        dice: v.dice, // wynik kostki
      };
      res.json(wysyłam);
    });
  },

  //* zarządzanie kostką
  throwDice(req, database) {
    let diceNumber = Math.floor(Math.random() * 6) + 1;
    this.setDice(diceNumber, req, database);
  },
  setDice(diceValue, req, database) {
    database.update(
      {
        _id: req.session.database._id,
      },
      {
        $set: {
          dice: diceValue,
        },
      },
      {}, // this argument was missing
      (err, numReplaced) => {
        database.persistence.compactDatafile(); //czyści DB
      }
    );
  },
  //*odczyt z bazy danych
  readDB(req, database) {
    let sprawdzamRequest = new Promise((suc, err) => {
      database.findOne(
        {
          _id: req.session.database._id,
        },
        function (error, doc) {
          suc(doc);
        }
      );
    });
    return sprawdzamRequest;
  },
  //* zarządzanie czasem
  tourMenager(req, database) {
    this.readDB(req, database).then((v) => {
      // this.readDB(req, database).then((v) => {
      if (req.session.whoAmI.nickname == v.countDownInit) {
        let response = v;
        if (response.remainingTime <= 0) {
          response.remainingTime = 60000;
          response.player = response.player + 1;
          if (response.players.length == response.player) {
            response.player = 0;
          }
          this.setDice(null, req, database);
        } else {
          response.remainingTime = response.remainingTime - 1000; // odejmuję sekundę
        }
        database.update(
          {
            //zapisuje do bazy danych
            _id: req.session.database._id,
          },
          {
            $set: {
              remainingTime: response.remainingTime,
              player: response.player,
            },
          },
          {}, // this argument was missing
          (err, numReplaced) => {
            database.persistence.compactDatafile(); //czyści DB
          }
        );
      } //if ost
      // });
    });
  },
  //* kończy kolejkę gracza => wymusza nową
  endPawnMove(req, database) {
    this.readDB(req, database).then((response) => {
      if (response.remainingTime > 1000) {
        // unikanie błędu z skipem kolejki
        response.remainingTime = 60000;
        response.player = response.player + 1;
        if (response.players.length == response.player) {
          response.player = 0;
        }
        this.setDice(null, req, database);
        database.update(
          {
            //zapisuje do bazy danych
            _id: req.session.database._id,
          },
          {
            $set: {
              remainingTime: 60000,
              player: response.player,
            },
          },
          {}, // this argument was missing
          (err, numReplaced) => {
            database.persistence.compactDatafile(); //czyści DB
          }
        );
      }
    });
  },
  //*koniec tworzenia planszy
  setMove(req, res, database) {
    let moveBegineTime = new Date().getTime();
    let maxMoveEndTime = moveBegineTime + 60000; //cała minuta
    let newMove = {
      player: req.session.whoAmI,
      moveBegineTime: moveBegineTime,
      maxMoveTime: maxMoveEndTime,
      actionFrom: null,
      actionTo: null,
      gameArray: [],
    };
    database.update(
      {
        _id: req.session.database._id,
      },
      {
        $set: {
          roomOccupants: room.roomOccupants,
        },
        $push: {
          players: newMove,
        },
      },
      {}, // this argument was missing
      (err, numReplaced) => {
        database.persistence.compactDatafile(); //czyści DB
      }
    );
  },

  //#######################____Zarządzanie odbiorem ruchu z bazy danych
  async move(req, database) {
    let bazaDanych = await this.readDB(req, database);
    if (await bazaDanych) {
      //*numer pionka
      let numerWyjscia = bazaDanych.pawnPositions[req.body.player].findIndex(
        // określa numer pionka w bazie danych
        (element) => JSON.stringify(element) == JSON.stringify(req.body.from)
      );
      //*sprawdza czy pionek jest na planszy
      let indexWTablicy = wspolrzedne.sciezkaGry.findIndex(
        // sprawdza czy pionek znajduje się na planszy jeśli tak zwraca jego pozycje nie => -1
        (element) => JSON.stringify(element) == JSON.stringify(req.body.from)
      );
      //* oblicza finalny index w tablicy => przemieszczenie
      let przesuniecie = indexWTablicy + bazaDanych.dice;
      if (przesuniecie == wspolrzedne.sciezkaGry.length - 1) przesuniecie = 0;
      else if (przesuniecie > wspolrzedne.sciezkaGry.length - 1)
        przesuniecie -= wspolrzedne.sciezkaGry.length - 2;
      console.log(`przesunięcie wynosi ${przesuniecie}`);
      //!!! TODO napraw zbijanie na pozycji wejściowej
      //*sprawdzam czy następuje zbicie i wykonuje je
      bazaDanych.pawnPositions.forEach((playerPosition, counter) => {
        if (counter != req.body.player)
          playerPosition.forEach((element, placement) => {
            if (
              JSON.stringify(element) ==
              JSON.stringify(
                indexWTablicy == -1
                  ? wspolrzedne.pozycjeWejsciowe[req.body.player]
                  : wspolrzedne.sciezkaGry[przesuniecie]
              )
            ) {
              console.log("następuje zbicie ");
              this.changeDBMove(
                counter, // odpowiednik gracza
                placement, // odpowiada numerowi wyjściowemu
                wspolrzedne.pozycjeWRogach[counter][placement], // pozycja domku docelowego
                bazaDanych._id,
                database
              );
            }
          });
      });
      //* wykonuje move
      this.changeDBMove(
        req.body.player,
        numerWyjscia,
        indexWTablicy == -1
          ? wspolrzedne.pozycjeWejsciowe[req.body.player]
          : wspolrzedne.sciezkaGry[przesuniecie],
        bazaDanych._id,
        database
      );
    }
  },
  changeDBMove(playerNum, pawnNum, destination, dbID, database) {
    return new Promise((suc, er) => {
      console.log(`pawnPositions.${playerNum}.${pawnNum}`, destination);
      database.update(
        {
          //zapisuje do bazy danych
          _id: dbID,
        },
        {
          $set: {
            [`pawnPositions.${playerNum}.${pawnNum}`]: [...destination],
          },
        },
        {}, // this argument was missing
        (err, numReplaced) => {
          database.persistence.compactDatafile(); //czyści DB
        }
      );
    });
  },
};
