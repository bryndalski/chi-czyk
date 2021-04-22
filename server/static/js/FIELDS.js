import { serverOperation } from "/js/XHHTP_CLASS.js";
import {
  pozycjeWRogach,
  sciezkaGry,
  pozycjeWejsciowe,
  pozycjeKoncowe,
  pozycjeWyjsciowe,
} from "./wspolrzedne.js";
import { config } from "/config/config.js";

export default class Field {
  constructor(x, y, element) {
    this.x = x;
    this.y = y;
    this.element = element; // div żeby życie było piękne
    this.inColor = null; // kolor wypełnienia tyczy się tylko pionków
    this.owner = null; // właściciel pionka
    this.ownerNumber = null; // numer właściciela pionka pomaga przy tablicack
    this.type = "field"; // pobiera z bazy danych i ustawia automatycznie pozycje na pionek lub pole
    this.active = false; //true || false => sprawdza czy pionek będzie można klikać czy jest np w dużej bazie
    this.belongsToPath = true; // sprawdza czy należy do podstawowej ścieżki gry => ułatwia mapowanie po stronie klienta + obliczanie pozycji następnego jest łatiwejsze
    this.firstElement = null; // pozycja wejściowa
    this.firstElementInArray = null; // pozycja 1 elementu w tablicy
    this.lastElement = null; // pozycja wyjściowa
    this.lastElementInArray = null; // pozycja ostatniego elementu w tablicy
    this.curremtPosition = null; // sprawdza czy znajduje się aktualnie w bazie lub w ostatnim domku
    this.otherFilds = []; // tablica wszystkich pionków
    this.dice = null; //opcje kostki na ich bazie oblicza gdzie ma się zatrzymać
    this.status = "spi"; // status : => może byc w bazie na planszy albo na środku bezpieczny
    this.pawnsArray = []; // zawiera informacje o pionkach
    this.lastPositions = []; //zawiera ostanie pozycje na środku dostępne dla tego pionka
    //do mrugania i klikania
    this.blinkInterval = null; // zawiera interwał mrugania
    this.currentPositionInArray = null; // aktualna pozycja w tablicb
    this.przesuniecie = null; //oblicza przesunięcie => docelowy index tablicy w którym powinien znaleźć się pionek
  }
  //getters
  get pawnToSend() {
    return {
      x: this.x,
      y: this.y,
      colorOne: this.inColor,
      colorTwo: this.colorTwo,
      active: this.status,
    };
  }
  get getX() {
    return this.x;
  }
  get getY() {
    return this.y;
  }
  get getOwner() {
    return this.owner;
  }

  //methods
  changeToPawn(inColor, owner, ownerNumber, currentPositionInArray) {
    this.owner = owner;
    this.active = true;
    this.ownerNumber = ownerNumber;
    this.inColor = inColor;
    this.element.style.background = `radial-gradient(${this.inColor},${this.inColor})`;
    this.firstElement = pozycjeWejsciowe[this.ownerNumber];
    this.lastElement = pozycjeWyjsciowe[this.ownerNumber];
    this.element.style.zIndex = 21;
    this.currentPositionInArray = currentPositionInArray;
    this.setBase();
  }
  //* ustawia nową tablice
  setOutherFilds(array) {
    this.otherFilds = array;
    if (this.ownerNumber != null) this.setBase();
  } //* zmiania kolor bordera przypisanego pionkowi
  changeBorder(color) {
    this.element.style.borderColor = color;
  }
  //*dostępne tylko dla pionków
  setBase() {
    this.otherFilds.forEach((index, counter) => {
      if (
        this.firstElement[0] == index.getX &&
        this.firstElement[1] == index.getY
      ) {
        this.firstElementInArray = counter;
        this.lastElementInArray =
          counter - 1 < 0 ? this.otherFilds.length - 1 : counter - 1;

        index.changeBorder(this.inColor);
      }
    });
    //?sprawdza czy pionek znajduje się w bazie  na ścieżce lub na końcu i nadaje mu status
    // console.log("sprawdzam pionka");
    if (this.ownerNumber != null)
      if (
        JSON.stringify(pozycjeWRogach[this.ownerNumber]).includes(
          JSON.stringify([this.x, this.y])
        )
      ) {
        this.status = "wDomku";
      } else if (
        JSON.stringify(sciezkaGry).includes(JSON.stringify([this.x, this.y]))
      ) {
        this.status = "naPlanszy";
      } else if (
        JSON.stringify(pozycjeKoncowe[this.ownerNumber]).includes(
          JSON.stringify([this.x, this.y])
        )
      ) {
        this.status = "wBazie";
      } else {
        this.active = false; // nieaktywny
        this.status = "spi";
      }
    else this.status = "spi";
    // console.log(this.status);
  }
  //?OPCJE DLA GRACZA
  enablePawn(dice) {
    console.log(this.status);
    this.dice = dice;
    switch (this.status) {
      case "wDomku":
        if (
          this.dice == 1 ||
          this.dice == 3 ||
          this.dice == 2 ||
          this.dice == 4 ||
          this.dice == 5 ||
          this.dice == 6
        ) {
          this.startMove();
        }
        break;
      case "wBazie":
        // console.log(
        //   `Jestem w bazie mój numer mojego właścieciela sekisaka koxaka sztosa totalnego to :  ${this.ownerNumber}`
        // );
        //! to zmień

        this.currentPositionInArray = pozycjeKoncowe[
          this.ownerNumber
        ].findIndex(
          (element) =>
            JSON.stringify(element) == JSON.stringify([this.x, this.y])
        );
        break;
      case "naPlanszy":
        this.przesuniecie = this.currentPositionInArray + this.dice;
        let expr = this.otherFilds.length - this.przesuniecie;
        if (expr === 0) {
          // console.log(
          //   `EXPR które nie działa przy 39 równa się ${expr} -przesunięcie wynosi ${this.przesuniecie} na ${this.otherFilds.length} ilość w tablicy !!!`
          // );
          this.przesuniecie = 0;
        } else if (expr < 0) {
          // console.log(
          //   `EXPR równa się ${expr} -przesunięcie wynosi ${this.przesuniecie} na ${this.otherFilds.length} ilość w tablicy !!!`
          // );
          this.przesuniecie = expr * -1;
        }
        // this.lastPositions.forEach((index) => index.setBase());
        console.log(
          this.przesuniecie > this.lastElementInArray &&
            (this.currentPositionInArray < this.firstElementInArray ||
              this.currentPositionInArray >= 36),
          this.przesuniecie > this.lastElementInArray,
          this.currentPositionInArray < this.firstElementInArray,
          this.currentPositionInArray >= 36,
          this.currentPositionInArray
        );
        //TODO DOPISZ WARUNEK AKTYWNYCH PIONKÓW ŻEBY MOŻNA WEJŚĆ DO BAZY BEZ NICZEGO
        if (
          this.przesuniecie > this.lastElementInArray &&
          (this.currentPositionInArray < this.firstElementInArray ||
            this.currentPositionInArray >= 36)
        ) {
          console.log(
            `wchodzę na start na starcie mogę wykonać ${
              this.przesuniecie - this.lastElementInArray - 1
            }`
          );
          this.status = "wBazie";
          this.przesuniecie = this.przesuniecie - this.lastElementInArray - 1;
          console.log(this.lastPositions[this.przesuniecie].status);
          console.log(this.lastPositions);
          console.log(
            this.przesuniecie < 4 &&
              this.lastPositions[this.przesuniecie].status == "spi"
          );
          if (
            this.przesuniecie < 4 &&
            this.lastPositions[this.przesuniecie].status == "spi"
          ) {
            console.log("POwinnem sie");
            console.log(this);
            this.startMove();
          }
        } else {
          this.startMove();
        }
        break;
      default:
        break;
    }
  }
  //* odpowiada za mruganie
  blink() {
    let blikStatus = true;
    this.blinkInterval = setInterval(() => {
      if (blikStatus) this.element.style.background = "rgba(0,0,0,0)";
      else
        this.element.style.background = `radial-gradient(${this.inColor},${this.inColor})`;
      blikStatus = !blikStatus;
    }, 500);
  }
  //*nadaje nową pozycje pionka
  setPositions(x, y) {
    this.element.style.top = y + "%";
    this.element.style.left = x + "%";
  }
  //* przejmuje kliknięcie
  handleClick = () => {
    switch (this.status) {
      case "wDomku":
        this.setPositions(
          this.otherFilds[this.firstElementInArray].x,
          this.otherFilds[this.firstElementInArray].y
        );
        this.sendMove();

        break;
      case "naPlanszy": {
        this.setPositions(
          this.otherFilds[this.przesuniecie].x,
          this.otherFilds[this.przesuniecie].y
        );
        this.sendMove();

        break;
      }
      case "wBazie":
        let nowyRuch = new serverOperation(null, null, config.newMove, null);
        nowyRuch.fetchData();
        nowyRuch.changeParams(
          null,
          {
            player: this.ownerNumber,
            from: [this.x, this.y],
            to: this.przesuniecie,
          },
          config.sendToBase,
          null
        );
        nowyRuch.sendData();
        break;
    }
    this.pawnsArray.forEach((index) => index.clearMove());
    //* TU WYSYŁA DO SERWERA PORZĄDANY PUNKT DOSTĘPU
  };
  //* obsługuje hoover
  handleHover = (e) => {
    this.element.style.cursor = "pointer";
    switch (this.status) {
      case "wDomku":
        this.otherFilds[this.firstElementInArray].element.style.filter =
          "invert(1)";
        break;
      case "naPlanszy":
        this.otherFilds[this.przesuniecie].element.style.filter = "invert(1)";
        break;
      case "wBazie":
        this.lastPositions[this.przesuniecie].element.style.filter =
          "invert(1)";
        break;
    }
    //*kalkuluję gdzie powinien trafić
  };
  //* obsługije wyjście myszki z pionka
  handelMouseOut = () => {
    switch (this.status) {
      case "wDomku":
        this.element.style.cursor = "default";
        this.otherFilds[this.firstElementInArray].element.style.filter =
          "invert(0)";
        break;
      case "naPlanszy":
        this.element.style.cursor = "default";
        this.otherFilds[this.przesuniecie].element.style.filter = "invert(0)";
        break;
      case "wBazie":
        this.element.style.cursor = "default";
        this.lastPositions[this.przesuniecie].element.style.filter =
          "invert(0)";
        break;
    }
  };
  //* czyści ruch
  clearMove() {
    this.active = false;
    this.element.removeEventListener("mouseenter", this.handleHover);
    this.element.removeEventListener("mouseleave", this.handelMouseOut);
    this.element.removeEventListener("click", this.handleClick);
    clearInterval(this.blinkInterval);
    this.element.style.background = `radial-gradient(${this.inColor},${this.inColor})`;
    this.lastPositions.forEach(
      (index) => (index.element.style.filter = "invert(0)")
    );
    this.otherFilds.forEach(
      (index) => (index.element.style.filter = "invert(0)")
    );
  }
  //* network
  sendMove() {
    let nowyRuch = new serverOperation(
      null,
      { player: this.ownerNumber, from: [this.x, this.y] },
      config.newMove,
      null
    );
    nowyRuch.sendData();
    nowyRuch.fetchData();
  }
  //*rozpoczyna ruch dla tego konkretnego pionka
  startMove() {
    this.active = true;
    this.blink();
    this.element.addEventListener("mouseenter", this.handleHover);
    this.element.addEventListener("mouseleave", this.handelMouseOut);
    this.element.addEventListener("click", this.handleClick);
  }
  //wywołuje się podczas tworzenia klas zawiera informacje
}
