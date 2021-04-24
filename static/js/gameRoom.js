"use strict";
import Field from "./FIELDS.js";
import {
  pozycjeWRogach,
  pozycjeWejsciowe,
  sciezkaGry,
  pozycjeKoncowe,
  pozycjeWyjsciowe,
} from "./wspolrzedne.js";
import userInGameOperations from "./gameRoomNetwork.js";

const createGameBord = {
  canvasElement: null, //htmlowy canvas
  canvasContext: null, // context tego canvasu
  canvasDivElement: null, //div "nakładka" na canvas
  canvasSize: null, // rozmiar canvasa
  gamePathArray: [], // zawiera samą tablicę ścieżki gry jako klasy
  users: [], // zawiera informacje o użytkownikach
  pawns: [], // zawiera informacje o pionkach
  assignedPawns: [], // zawiera pionki
  lastFil: [], // zawiera wszystkie pozycje końcowe w grze
  //*inicjuje canvas do zostawiania
  setCanvas() {
    this.canvasElement = document.querySelector("canvas");
    this.canvasDivElement = document.querySelector(".fieldContainer");
    this.canvasContext = this.canvasElement.getContext("2d");
  },
  //*odpowiada za skalowanie canvasu oraz diva nakładki
  scale() {
    this.canvasSize = document
      .querySelector(".cnvContainer")
      .getBoundingClientRect(); // położenie względem okna
    if (this.canvasSize.width > 900) {
      this.canvasSize.width = 900;
      this.canvasSize.height = 900;
    }
    //skaluję canvasy i div container żeby zawsze miały tyle samo
    this.canvasElement.width = this.canvasSize.width; //     Zbieram sobie rozmiar canvasa
    this.canvasElement.height = this.canvasSize.height;
    //*skaluję canvas
    this.canvasContext.scale(1, 1); //skaluje
    //*rysuję ścieżkę gry
    this.drawGamePath();
    //skaluję divy i czyszczę będący containerem planszy
    this.canvasDivElement.innerHTML = "";
    this.canvasDivElement.style.top =
      Math.floor(this.canvasElement.offsetTop) + 5 + "px";
    this.canvasDivElement.style.left =
      Math.floor(this.canvasElement.offsetLeft) + 5 + "px";
    this.canvasDivElement.style.width =
      Math.floor(this.canvasSize.width) + "px"; // zmieniam rozmiar diva
    this.canvasDivElement.style.height =
      Math.floor(this.canvasSize.height) + "px"; // zmieniam rozmiar diva
  },
  //*odpoowiada za rysowanie od nowa planszy
  resize() {
    createGameBord.scale(); //skaluje
    //*rysuję pola z poza grą => pozycje w rogach i na środku
    createGameBord.drawInActiveFileds();
    createGameBord.drawActiveFileds();
    userInGameOperations.assignNewPawns(this.assignedPawns);
  },
  //* rysuje pola aktywne
  drawActiveFileds() {
    this.assignedPawns = [];
    this.gamePathArray = [];
    sciezkaGry.forEach((index, counter) => {
      // rysuje ścieżkę gey
      this.gamePathArray.push(
        new Field(
          index[0],
          index[1],
          this.drawFiled(
            this.canvasSize.height * (index[0] / 100), //TODO zmień na x
            this.canvasSize.height * (index[1] / 100), //TODO zmień na y
            this.canvasSize.height * (6 / 100),
            "rgb(0, 0, 0, 0.3)",
            "rgb(0,0,0,0.3)",
            "rgb(0,0,0,0.3)"
          )
        )
      );
    });
    this.pawns.forEach((index, counter) => {
      let zmienia = false;
      this.gamePathArray.forEach((elem, iCounter) => {
        if (elem.getX == index.x && elem.getY == index.y) {
          zmienia = true;
          elem.changeToPawn(
            index.color,
            index.owner,
            Math.floor(counter / 4),
            iCounter
          ); // pionki są zawsze wielokrotnością 4
          this.assignedPawns.push(elem);
        }
      });
      if (!zmienia) {
        let independendPawn = new Field(
          index.x,
          index.y,
          this.drawFiled(
            this.canvasSize.height * (index.x / 100), //TODO zmień na x
            this.canvasSize.height * (index.y / 100), //TODO zmień na y
            this.canvasSize.height * (6 / 100),
            index.color,
            index.color,
            index.color
          )
        );
        independendPawn.changeToPawn(
          index.color,
          index.owner,
          Math.floor(counter / 4),
          null
        );
        this.assignedPawns.push(independendPawn);
      }
    });
    //*dodaje każdemu pionkowi informacje o innych ponieważ pracuje tylko na pionkach i fomruje bazy
    let licznkik = -1;
    this.assignedPawns.forEach((index) => index.setBase());

    this.assignedPawns.forEach((index, counter) => {
      if (counter % 4 == 0) licznkik++;
      index.setOutherFilds(this.gamePathArray);
      index.pawnsArray = this.assignedPawns;
      index.lastPositions = this.lastFil[licznkik];
    });
  },
  //*rysuje nie aktywne pola, które nie mają ingerencji z użytkownikiem => pola w rogach planszy + na samym środku
  drawInActiveFileds() {
    //* pozycje na samym środku końcowe => bez możliwości manipulacji
    pozycjeKoncowe.forEach((elem, counter) => {
      this.lastFil[counter] = [];
      elem.forEach((index) => {
        let pole = new Field(
          index[0],
          index[1],
          this.drawFiled(
            this.canvasSize.height * (index[0] / 100), //TODO zmień na x
            this.canvasSize.height * (index[1] / 100), //TODO zmień na y
            this.canvasSize.height * (6 / 100),
            "rgb(0,0,0,0)",
            "rgb(0,0,0,0)",
            this.users[counter] == undefined
              ? "red"
              : `rgb(${this.users[counter].R},${this.users[counter].G},${this.users[counter].B})`
          )
        );
        pole.ownerNumber = counter;
        pole.setBase();
        this.lastFil[counter].push(pole);
      });
    });
    //* pozycje na rogach => czyste bez możliwości manipulacji pionek znajduje się fizycznie nad nimi
    pozycjeWRogach.forEach((elem, counter) => {
      elem.forEach((index) => {
        this.drawFiled(
          this.canvasSize.height * (index[0] / 100), //TODO zmień na x
          this.canvasSize.height * (index[1] / 100), //TODO zmień na y
          this.canvasSize.height * (6 / 100),
          "rgb(0,0,0,0)",
          "rgb(0,0,0,0)",
          this.users[counter] == undefined
            ? "red"
            : `rgb(${this.users[counter].R},${this.users[counter].G},${this.users[counter].B})`
        );
      });
    });
  },
  //*tworzy pole na canvasie
  drawFiled(x, y, srednica, incolor, outcolor, border) {
    let div = document.createElement("div");
    div.style.left = x + "px";
    div.style.top = y + "px";
    div.style.width = srednica + "px";
    div.style.height = srednica + "px";
    div.style.borderColor = border;
    div.style.background = `radial-gradient(${incolor},${outcolor})`;
    this.canvasDivElement.appendChild(div);
    return div;
  },
  //*tworzy ścieżkę na canvasie ** do zostaiwenia
  drawGamePath() {
    this.canvasContext.beginPath(); //                   XXXXXXXX                              YYYYYYYY
    this.canvasContext.moveTo(
      this.canvasSize.height * (5 / 100),
      this.canvasSize.height * (60 / 100)
    );
    this.canvasContext.lineTo(
      this.canvasSize.height * (5 / 100),
      this.canvasSize.height * (40 / 100)
    );
    this.canvasContext.lineTo(
      this.canvasSize.height * (40 / 100),
      this.canvasSize.height * (40 / 100)
    );
    this.canvasContext.lineTo(
      this.canvasSize.height * (40 / 100),
      this.canvasSize.height * (5 / 100)
    );
    this.canvasContext.lineTo(
      this.canvasSize.height * (60 / 100),
      this.canvasSize.height * (5 / 100)
    );
    this.canvasContext.lineTo(
      this.canvasSize.height * (60 / 100),
      this.canvasSize.height * (40 / 100)
    );
    this.canvasContext.lineTo(
      this.canvasSize.height * (95 / 100),
      this.canvasSize.height * (40 / 100)
    );
    this.canvasContext.lineTo(
      this.canvasSize.height * (95 / 100),
      this.canvasSize.height * (60 / 100)
    );
    this.canvasContext.lineTo(
      this.canvasSize.height * (60 / 100),
      this.canvasSize.height * (60 / 100)
    );
    this.canvasContext.lineTo(
      this.canvasSize.height * (60 / 100),
      this.canvasSize.height * (95 / 100)
    );
    this.canvasContext.lineTo(
      this.canvasSize.height * (40 / 100),
      this.canvasSize.height * (95 / 100)
    );
    this.canvasContext.lineTo(
      this.canvasSize.height * (40 / 100),
      this.canvasSize.height * (60 / 100)
    );
    this.canvasContext.closePath();
    this.canvasContext.stroke();
  },
};
export { createGameBord };
