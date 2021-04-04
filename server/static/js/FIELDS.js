import {
  pozycjeWRogach,
  pozycjeWejsciowe,
  sciezkaGry,
  pozycjeKoncowe,
  pozycjeWyjsciowe,
} from "./wspolrzedne.js";

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

    //do mrugania i klikania
    this.blinkInterval = null; // zawiera interwał mrugania
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
  changeToPawn(inColor, owner, ownerNumber) {
    this.owner = owner;
    this.active = true;
    this.ownerNumber = ownerNumber;
    this.inColor = inColor;
    this.element.style.background = `radial-gradient(${this.inColor},${this.inColor})`;
    this.firstElement = pozycjeWejsciowe[this.ownerNumber];
    this.lastElement = pozycjeWyjsciowe[this.ownerNumber];
    this.element.style.zIndex = 21;
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
        this.element.addEventListener("mouseover", this.handleHover);
        this.element.addEventListener("mouseleave", this.handelMouseOut);
      }
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
  handleClick = () => {
    //* TU WYSYŁA DO SERWERA PORZĄDANY PUNKT DOSTĘPU
  };
  handleHover = (e) => {
    console.log(this);
    this.element.style.cursor = "pointer";
    //*kalkuluję gdzie powinien trafić
    if (this.status == "wDomku") {
      console.log("soema");
      console.log(this.otherFilds[this.firstElementInArray]);
      this.otherFilds[this.firstElementInArray].element.style.filter =
        "invert(1)";
    }
  };
  handelMouseOut = () => {
    this.element.style.cursor = "default";
    this.otherFilds[this.firstElementInArray].element.style.filter =
      "invert(0)";
  };
  clearMove() {
    this.element.removeEventListener("mouseover", this.handleHover);
    this.element.removeEventListener("mouseleave", this.handelMouseOut);
    clearInterval(this.blinkInterval);
    this.element.style.background = `radial-gradient(${this.inColor},${this.inColor})`;
    this.handelMouseOut();
  }

  //wywołuje się podczas tworzenia klas zawiera informacje
}

/*
NIM ZAPOMNIJSZ

koncowe pozycje określasz na bazie współrzędnych tak aby każdy pionek dostał indywidualną pozycję końcową przypisaną tylko jemu
ewenutalnie możesz sprawdzać które zostały ale to opcja trydneijsza zobacz jak z czasem storisz


wejście do bazy => wtedy gdy wyrzuci się liczbę dzielącą pionek od pkt do bazy (lastElement)


*/
