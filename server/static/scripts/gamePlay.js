'use stric'
const pozycjePodstawowe = [
    [5, 40], // 9
    [60, 5], // 12
    [95, 60], //3
    [40, 95], // 6
]
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
]
const domki = [ //te śmieszne na środku
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
    ]
]
const bazy = [ //pozycje pionków w rogach (ich macierzyste położenie)
    [
        [5, 5],
        [5, 14],
        [13, 5],
        [13, 14]
    ],
    [
        [85, 5],
        [85, 14],
        [93, 5],
        [93, 14]
    ],
    [
        [95, 95],
        [95, 87],
        [87, 95],
        [87, 87]
    ],
    [
        [5, 95],
        [5, 87],
        [13, 95],
        [13, 87]
    ],
]
module.exports = {
    //* tworzenie planszy 
    handleUserInit(req, pokojeAktualne) { // inicjowanie planszy na pozycji podstiaj 
        //towrzę osobę która zaczyna swoją gierkę
        //*Ustawiam bazę danych jako jedyną rzecz którą niezależnie od sesji i requestów s serwera swobodnie modyfikuję
        this.readDB(req, pokojeAktualne).then(v => {
            if (v.countDownInit) {
                pokojeAktualne.update({ //zapisuje do bazy danych 
                        _id: req.session.database._id
                    }, {
                        $set: {
                            remainingTime: 60000,
                            player: 0,
                            countDownInit: req.session.whoAmI.nickname,
                        },
                    }, {}, // this argument was missing
                    (err, numReplaced) => {
                        pokojeAktualne.persistence.compactDatafile() //czyści DB 
                    }
                );
            }
        })
        //wysyłam listę aktualnych pionków => ponieważ funkcja wywołuje się 1 w momencie inicjacji pionki znajdują się w bazach (tych śmiesznych po rogach)
        let pawnPositions = []
        // tworzy wszystkie położenia pionków na mapie niezależnie od użytkownika
        req.session.database.players.forEach((element, counter) => {
            bazy[counter].forEach(index => {
                pawnPositions.push({
                    pozycja: [...index],
                    colorOne: `rgb(${element.R},${element.G},${element.B})`,
                    colorTwo: `rgb(${element.R},${element.G},${element.B})`,
                    status: "active"
                })
            })
        });
        let basicBord = this.createBasicBord(req, pokojeAktualne)
        req.session.pawnPosition = pawnPositions //przechowywuję pozycje pionków 
        req.session.basicBord = basicBord // przechowywuję "czystą" planszę w razie restartu 
        // //*koniec sesji
    },
    createBasicBord(req, database) {
        let plansza = []
        //basic colory dla ścieżki
        gamePRCT.forEach((index) => {
            plansza.push({
                pozycja: [...index],
                colorOne: "rgb(0, 0, 0, 0.3)",
                colorTwo: "rgb(0, 0, 0, 0.3)"
            })
        })
        //basic colory dla domków tych w rogach => domyślnie niebiesko czarne i nadrpisane pozycjami z pionków 
        bazy.forEach(element => {
            element.forEach(index => {
                plansza.push({
                    pozycja: [...index],
                    colorOne: "blue",
                    colorTwo: "black"
                })
            });
        });
        //dla tych na środku 
        domki.forEach((element, counter) => {
            element.forEach((index) => {
                if (req.session.database.players[counter])
                    plansza.push({
                        pozycja: [...index],
                        colorOne: `rgb(${req.session.database.players[counter].R},${req.session.database.players[counter].G},${req.session.database.players[counter].B},0.2)`,
                        colorTwo: `rgb(${req.session.database.players[counter].R},${req.session.database.players[counter].G},${req.session.database.players[counter].B},0.2)`
                    })
                else
                    plansza.push({
                        pozycja: [...index],
                        colorOne: "blue",
                        colorTwo: "black"
                    })
            });
        });
        //dla pozycji startowych
        pozycjePodstawowe.forEach((index, counter) => {
            if (req.session.database.players[counter])
                plansza.push({
                    pozycja: [...index],
                    colorOne: `rgb(${req.session.database.players[counter].R},${req.session.database.players[counter].G},${req.session.database.players[counter].B},0.2)`,
                    colorTwo: "rgb(51,51,51)"
                })
            else
                plansza.push({
                    pozycja: [...index],
                    colorOne: "blue",
                    colorTwo: "black"
                })
        });
        return plansza
    },
    movePawn() {},
    //*koniec tworzenia planszy 
    setMove(req, res, database) {
        let moveBegineTime = new Date().getTime()
        let maxMoveEndTime = moveBegineTime + 60000 //cała minuta 
        let newMove = {
            player: req.session.whoAmI,
            moveBegineTime: moveBegineTime,
            maxMoveTime: maxMoveEndTime,
            actionFrom: null,
            actionTo: null,
            gameArray: []
        }
        database.update({
                _id: req.session.database._id
            }, {
                $set: {
                    roomOccupants: room.roomOccupants,
                },
                $push: {
                    players: newMove
                }
            }, {}, // this argument was missing
            (err, numReplaced) => {
                database.persistence.compactDatafile() //czyści DB 
            }
        );
    },
    //* zarządzanie kostką
    throwDice(req, database) {
        let diceNumber = Math.floor(Math.random() * 6) + 1
        this.setDice(diceNumber, req, database)
    },
    setDice(diceValue, req, database) {
        database.update({
                _id: req.session.database._id
            }, {
                $set: {
                    dice: diceValue,
                },
            }, {}, // this argument was missing
            (err, numReplaced) => {
                database.persistence.compactDatafile() //czyści DB 
            }
        );
    },
    //*zarządzanie ruchami
    async handelGame(req, res, database) {
        //sprawdzam czy synchronizacja została wymuszona
        this.readDB(req, database).then((v) => {
            let wysyłam = {
                remainingTime: v.remainingTime / 1000, // czas w ludzkim formacie 
                movePlayer: v.gamer, // rozgrywający
                reqSendTime: req.session.incoming, //do synchronizacji
                dice: v.dice // wynik kostki
            }
            console.log(wysyłam);
            res.json(wysyłam)
        })
    },
    //*odczyt z bazy danych 
    readDB(req, database) {
        let sprawdzamRequest = new Promise((suc, err) => {
            database.findOne({
                _id: req.session.database._id
            }, function (error, doc) {
                suc(doc)
            })
        })
        return sprawdzamRequest
    },
    //* zarządzanie czasem
    tourMenager(req, database) {
        this.readDB(req, database).then(v => {
            this.readDB(req, database).then(v => {
                if (req.session.whoAmI.nickname == v.countDownInit) {
                    let response = v
                    if (response.remainingTime <= 0) {
                        response.remainingTime = 60000
                        response.gamer = response.gamer + 1
                        if (response.players.length == response.gamer) {
                            response.gamer = 0
                        }
                        //resetuje kostkę jako NULL
                        this.setDice(null, req, database)
                    } else {
                        response.remainingTime = (response.remainingTime - 1000) // odejmuję sekundę 
                    }
                    database.update({ //zapisuje do bazy danych 
                            _id: req.session.database._id
                        }, {
                            $set: {
                                remainingTime: response.remainingTime,
                                gamer: response.gamer,
                            },
                        }, {}, // this argument was missing
                        (err, numReplaced) => {
                            database.persistence.compactDatafile() //czyści DB 
                        }
                    )
                } //if ost
            });
        });
    }
}