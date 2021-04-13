"use stric";

const { json } = require("body-parser");
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
        /*
          {
            // z tablic
            x: X
            y: Y
            // z informacj i użytkowniku
            właściciel
            kolor1

          }
        */
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
          //resetuje kostkę jako NULL
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
  async move(req, res, database) {
    let bazaDanych = await this.readDB(req, database);
    if (await bazaDanych) {
      let doUsuniecia = false;
      //numer pionka
      let numerWyjscia = bazaDanych.pawnPositions[req.body.player].findIndex(
        (element) => JSON.stringify(element) == JSON.stringify(req.body.from)
      );
      //sprawdza czy pionek jest na planszy
      let indexWTablicy = wspolrzedne.sciezkaGry.findIndex(
        (element) => JSON.stringify(element) == JSON.stringify(req.body.from)
      );
      //przemieszczanie
      if (indexWTablicy == -1) {
        this.changeDBMove(
          req.body.player,
          numerWyjscia,
          wspolrzedne.pozycjeWejsciowe[req.body.player],
          bazaDanych._id,
          database,
          res
        );
      } else {
        let zbija = false; //? dodaj algorytm sprawdzanian, czy koordynaty podane nie znajdują się w innych niż twoje pozycjach
        let daneZbicia = [];
        // algorytm zbijania
        let przesiniecie = indexWTablicy + bazaDanych.dice;
        if (indexWTablicy + bazaDanych.dice > wspolrzedne.sciezkaGry.length) {
          przesiniecie =
            -1 *
            (wspolrzedne.sciezkaGry.length - 1 - indexWTablicy.bazaDanych.dice);
        } //zmianiam baze danych
        //*sprawdzam czy następuje zbicie i wykonuje je
        bazaDanych.pawnPositions.forEach((playerPosition, counter) => {
          if (counter != req.body.player)
            playerPosition.forEach((element, placement) => {
              if (
                JSON.stringify(element) ==
                JSON.stringify(wspolrzedne.sciezkaGry[placement])
              ) {
                zbija = true;
                daneZbicia = [
                  counter, // odpowiednik gracza
                  placement, // odpowiada numerowi wyjściowemu
                  wspolrzedne.pozycjeWRogach[placement], // pozycja domku docelowego
                  bazaDanych._id,
                  database,
                  res,
                ];
              }
            });
        });

        //zbijando po prostu odsyła pionek hen hdzieś niewiadomo gdzie
        if (zbija) {
          this.changeDBMove(...daneZbicia);
        }
        //obliczam index końcowy dla przemieszczenia
        //!! sprawdź przesunięcie o 1

        this.changeDBMove(
          req.body.player,
          numerWyjscia,
          wspolrzedne.sciezkaGry[przesiniecie],
          bazaDanych._id,
          database,
          res
        );
      }
      // let pozycjaPionkaWTablicyGry =
    }
  },
  changeDBMove(playerNum, pawnNum, destination, dbID, database, res) {
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
            remainingTime: 0,
          },
        },
        {}, // this argument was missing
        (err, numReplaced) => {
          database.persistence.compactDatafile(); //czyści DB
          if (err) res.json({ success: false });
          else res.json({ success: true });
        }
      );
    });
  },
};
