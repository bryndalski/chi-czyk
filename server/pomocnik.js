// <<<<----PRZECHOWUJE WSPÓŁRZĘDNE KTÓRE JESZCZE SIĘ PRZYDADZĄ --->>>>>

const pozycjePodstawowe = [
  [5, 40], // 9
  [60, 5], // 12
  [95, 60], //3
  [40, 95], // 6
];
const gamePRCT = [
  [5, 60],
  [5, 50],
  [5, 40], // startowa pozycja na 9
  [13, 40],
  [22, 40],
  [31, 40],
  [40, 40],
  //
  [40, 32],
  [40, 23],
  [40, 14],
  [40, 5],
  [50, 5],
  [60, 5], // startowa pozycja na 12
  //
  [60, 14],
  [60, 23],
  [60, 32],
  [60, 40],
  //
  [69, 40],
  [78, 40],
  [86, 40],
  [95, 40],
  [95, 50],
  [95, 60], //startowa pozcyja na 3
  //
  [86, 60],
  [78, 60],
  [69, 60],
  [60, 60],
  [60, 69],
  //
  [60, 78],
  [60, 87],
  [60, 95],
  [50, 95],
  //
  [40, 95], // startowa pozycja na 6
  [40, 87],
  [40, 78],
  [40, 69],
  //
  [13, 60],
  [22, 60],
  [31, 60],
  [40, 60],
];

const domki = [
  //te śmieszne na środku
  // na 9
  [
    [13, 50],
    [22, 50],
    [31, 50],
    [40, 50],
  ],
  //na 12
  [
    [50, 40],
    [50, 32],
    [50, 23],
    [50, 14],
  ],
  // na 3
  [
    [60, 50],
    [69, 50],
    [78, 50],
    [86, 50],
  ],
  // na 6
  [
    [50, 87],
    [50, 78],
    [50, 69],
    [50, 60],
  ],
];

const bazy = [
  //pozycje pionków w rogach (ich macierzyste położenie)
  [
    [5, 5],
    [5, 14],
    [13, 5],
    [13, 14],
  ],
  [
    [85, 5],
    [85, 14],
    [93, 5],
    [93, 14],
  ],
  [
    [95, 95],
    [95, 87],
    [87, 95],
    [87, 87],
  ],
  [
    [5, 95],
    [5, 87],
    [13, 95],
    [13, 87],
  ],
];

//śmieci
/*

 gamePRCT.forEach((index) => {
      plansza.push({
        pozycja: [...index],
      });
    });
    //basic colory dla domków tych w rogach => domyślnie niebiesko czarne i nadrpisane pozycjami z pionków
    bazy.forEach((element) => {
      element.forEach((index) => {
        plansza.push({
          pozycja: [...index],
          colorOne: "blue",
          colorTwo: "black",
        });
      });
    });
    //dla tych na środku
    domki.forEach((element, counter) => {
      element.forEach((index) => {
        if (req.session.database.players[counter])
          plansza.push({
            pozycja: [...index],
            colorOne: `rgb(${req.session.database.players[counter].R},${req.session.database.players[counter].G},${req.session.database.players[counter].B},0.2)`,
            colorTwo: `rgb(${req.session.database.players[counter].R},${req.session.database.players[counter].G},${req.session.database.players[counter].B},0.2)`,
          });
        else
          plansza.push({
            pozycja: [...index],
            colorOne: "blue",
            colorTwo: "black",
          });
      });
    });
    //dla pozycji startowych
    pozycjePodstawowe.forEach((index, counter) => {
      if (req.session.database.players[counter])
        plansza.push({
          pozycja: [...index],
          colorOne: `rgb(${req.session.database.players[counter].R},${req.session.database.players[counter].G},${req.session.database.players[counter].B},0.2)`,
          colorTwo: "rgb(51,51,51)",
        });
      else
        plansza.push({
          pozycja: [...index],
          colorOne: "blue",
          colorTwo: "black",
        });
    });


    
*/

//* kolry
/*
    dla ścieżki: 
        colorOne: "rgb(0, 0, 0, 0.3)",
        colorTwo: "rgb(0, 0, 0, 0.3)",
    
    dla domków na środku :
    if (req.session.database.players[counter]) // jeśli player istnieje jeśli nie nie tworzymy 
        plansza.push({
          colorOne: `rgb(${req.session.database.players[counter].R},${req.session.database.players[counter].G},${req.session.database.players[counter].B},0.2)`,
          colorTwo: `rgb(${req.session.database.players[counter].R},${req.session.database.players[counter].G},${req.session.database.players[counter].B},0.2)`,
        });

    dla pozycji podstawowych tych na rogach jeśli nie istnieje przypisuje kolor podstawowy:
        istnieje : 
         colorOne: `rgb(${req.session.database.players[counter].R},${req.session.database.players[counter].G},${req.session.database.players[counter].B},0.2)`,
         colorTwo: "rgb(51,51,51)",
        nie istnieje"
          colorOne: "rgb(0, 0, 0, 0.3)",
          colorTwo: "rgb(0, 0, 0, 0.3)",

    */

//!!! SZYBKIE ZEBRANIE MYŚLKI =>
/*
        Do naprawy => serwer niech wysyła dane o pionkach dodać pozycje do odesłąnai zapiszesz każde pole w klasie wraz z jego kordynatami i będziesz mógł
        rerenderować i klikać i sprawdzać czy kliknąłeś czy nie 

        ====

        ====

        sprawdź opcje kolizji ścieżki z mouse pointerem dodanym jsowo hooverem 

        ====

        klasa może obliczać gdzie upadnie wykorzystaj to

        ====


        === 

        !!!!

        zmień pola na divyu absolute użyj tablicy pkt z serwera 

        
        */
//!!!rysuje pionki do wyrzucenia zminić typy z serwera
