import { serverOperation } from "/js/XHHTP_CLASS.js";
import {
  pozycjeWRogach,
  pozycjeWejsciowe,
  sciezkaGry,
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
    this.active = true; //true || false => sprawdza czy pionek będzie można klikać czy jest np w dużej bazie
    this.belongsToPath = true; // sprawdza czy należy do podstawowej ścieżki gry => ułatwia mapowanie po stronie klienta + obliczanie pozycji następnego jest łatiwejsze
    this.firstElement = null; // pozycja wejściowa
    this.firstElementInArray = null; // pozycja 1 elementu w tablicy
    this.lastElement = null; // pozycja wyjściowa
    this.lastElementInArray = null; // pozycja ostatniego elementu w tablicy
    this.curremtPosition = null; // sprawdza czy znajduje się aktualnie w bazie lub w ostatnim domku
    this.otherFilds = []; // tablica wszystkich pionków
    this.dice = null; //opcje kostki na ich bazie oblicza gdzie ma się zatrzymać
    this.status = ""; // status : => może byc w bazie na planszy albo na środku bezpieczny
    this.pawnsArray = []; // zawiera informacje o pionkach
    //do mrugania i klikania
    this.blinkInterval = null; // zawiera interwał mrugania
    this.currentPositionInArray = null;
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
  setOutherFilds(array) {
    this.otherFilds = array;
    if (this.ownerNumber != null) this.setBase();
  }
  changeBorder(color) {
    this.element.style.borderColor = color;
  }
  //!dostępne tylko dla pionków  prototyp
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
    //sprawdza czy pionek znajduje się w bazie  na ścieżce lub na końcu i nadaje mu status
    if (
      JSON.stringify(pozycjeWRogach[this.ownerNumber]).includes(
        JSON.stringify([this.x, this.y])
      )
    ) {
      this.status = "wDomku";
    } else if (
      JSON.stringify(!pozycjeKoncowe[this.ownerNumber]).includes(
        JSON.stringify([this.x, this.y])
      )
    ) {
      this.status = "naPlanszy";
    } else {
      this.active = false; // nieaktywny
      this.status = "spi";
    }
  }
  //?OPCJE DLA GRACZA
  enablePawn(dice) {
    this.dice = dice;
    if (this.status == "wDomku") {
      // sprawdzam czy może wyjśc (1 lub 6)
      if (
        this.dice == 1 ||
        this.dice == 3 ||
        this.dice == 2 ||
        this.dice == 4 ||
        this.dice == 5 ||
        this.dice == 6
      ) {
        this.blink();
        this.element.addEventListener("mouseenter", this.handleHover);
        this.element.addEventListener("mouseleave", this.handelMouseOut);
        this.element.addEventListener("click", this.handleClick);
      }
    } else if ((this.status = "naPlanszy")) {
      this.blink();
      this.element.addEventListener("mouseenter", this.handleHover);
      this.element.addEventListener("mouseleave", this.handelMouseOut);
      this.element.addEventListener("click", this.handleClick);
    } else {
    }
  }
  blink() {
    let blikStatus = true;
    this.blinkInterval = setInterval(() => {
      if (blikStatus) this.element.style.background = "rgba(0,0,0,0)";
      else
        this.element.style.background = `radial-gradient(${this.inColor},${this.inColor})`;
      blikStatus = !blikStatus;
    }, 500);
  }
  setPositions(x, y) {
    this.element.style.top = y + "%";
    this.element.style.left = x + "%";
  }
  //* przejmuje kliknięcie
  handleClick = () => {
    if ((this.status = "wDomku")) {
      this.setPositions(
        this.otherFilds[this.firstElementInArray].x,
        this.otherFilds[this.firstElementInArray].y
      );
      this.sendMove([
        this.otherFilds[this.firstElementInArray].x,
        this.otherFilds[this.firstElementInArray].y,
      ]);
    }
    this.pawnsArray.forEach((index) => index.clearMove());
    //* TU WYSYŁA DO SERWERA PORZĄDANY PUNKT DOSTĘPU
  };
  //* obsługuje hoover
  handleHover = (e) => {
    this.element.style.cursor = "pointer";
    //*kalkuluję gdzie powinien trafić
    if (this.status == "wDomku") {
      this.otherFilds[this.firstElementInArray].element.style.filter =
        "invert(1)";
    } else if (this.status == "naPlanszy") {
      let przesuniecie = this.currentPositionInArray + this.dice;
      if (
        this.currentPositionInArray + this.dice >
        this.otherFilds.length - 1
      ) {
        przesuniecie =
          -1 *
            (this.otherFilds.length -
              (this.currentPositionInArray + this.dice)) -
          1;
      }
      console.log(przesuniecie);
      this.otherFilds[przesuniecie].element.style.filter = "invert(1)";
    }
  };
  //* obsługije wyjście myszki z pionka
  handelMouseOut = () => {
    this.element.style.cursor = "default";
    this.otherFilds[this.firstElementInArray].element.style.filter =
      "invert(0)";
  };
  //* czyści ruch
  clearMove() {
    this.element.removeEventListener("mouseenter", this.handleHover);
    this.element.removeEventListener("mouseleave", this.handelMouseOut);
    this.element.removeEventListener("click", this.handleClick);
    clearInterval(this.blinkInterval);
    this.element.style.background = `radial-gradient(${this.inColor},${this.inColor})`;
  }
  //! network
  sendMove(destination) {
    console.log({
      player: this.ownerNumber,
      from: [this.y, this.x],
    });
    let nowyRuch = new serverOperation(
      null,
      { player: this.ownerNumber, from: [this.x, this.y] },
      config.newMove,
      null
    );
    nowyRuch.sendData().then((v) => console.log(v));
  }
  //wywołuje się podczas tworzenia klas zawiera informacje
}

/*
NIM ZAPOMNIJSZ

koncowe pozycje określasz na bazie współrzędnych tak aby każdy pionek dostał indywidualną pozycję końcową przypisaną tylko jemu
ewenutalnie możesz sprawdzać które zostały ale to opcja trydneijsza zobacz jak z czasem storisz


wejście do bazy => wtedy gdy wyrzuci się liczbę dzielącą pionek od pkt do bazy (lastElement)


*/
