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
    this.lastElement = null; // pozycja wyjściowa
    this.otherFilds = []; // tablica wszystkich pionków
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
  }
  setOutherFilds(array) {
    this.otherFilds = array;
  }
  changeBorder(color) {
    this.element.style.borderColor = color;
  }
  //dostępne tylko dla pionków
  setBase() {
    this.otherFilds.forEach((index, counter) => {
      if (this.getX == index.x && this.getY == index.getY) {
        index.changeBorder("red");
      }
    });
  }
  //wywołuje się podczas tworzenia klas zawiera informacje
}

/*
NIM ZAPOMNIJSZ

koncowe pozycje określasz na bazie współrzędnych tak aby każdy pionek dostał indywidualną pozycję końcową przypisaną tylko jemu
ewenutalnie możesz sprawdzać które zostały ale to opcja trydneijsza zobacz jak z czasem storisz



*/