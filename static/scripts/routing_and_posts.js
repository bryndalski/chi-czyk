const user = require("./addToRoom");
const whoWantsToPlay = require("./whoWantsToPlay");
const newUser = require("./newUser");
const player = require("./gamePlay");
module.exports = function (app, path, dirname, pokojeAktualne) {
  //* ROUTE section
  app.get("/", (req, res) => {
    if (req.session.database == undefined)
      res.sendFile(path.join(dirname + "/static/pages/setUp.html"));
    else if (req.session.waiting) res.redirect("/poczekalnia");
    else res.redirect("/chinaGameplay");
  });
  app.get("/poczekalnia", (req, res) => {
    if (req.session.database == undefined) res.redirect("/");
    else if (req.session.waiting)
      res.sendFile(path.join(dirname + "/static/pages/waitingRoom.html"));
    else res.redirect("/chinaGameplay");
  });

  app.get("/chinaGameplay", (req, res) => {
    if (req.session.database == undefined) res.redirect("/");
    else {
      if (req.session.database.roomOccupants == 4) req.session.waiting = false;
      if (req.session.waiting) res.redirect("/poczekalnia");
      else res.sendFile(path.join(dirname, "/static/pages/game.html"));
    }
  });

  app.get("/getUsers", (req, res) => {
    res.json({
      whoAmI: req.session.whoAmI,
      players: req.session.database.players,
    });
  });
  app.get("/pawnPosition", (req, res) => {
    //w zależności od sytuacji jeśli gra została zainicjowana odsyła albo czyste położenie początkowe albo
    req.session.incoming = new Date().getTime();
    if (req.session.database) {
      if (!req.session.firstInit) {
        player.handleUserInit(req, pokojeAktualne); // inicjuje odliczanie przez 1 użytkownika który wszedł do gry
        setInterval(() => {
          player.tourMenager(req, pokojeAktualne); // odpalam niezależną kolejkę
        }, 1000);
      }
      player.getPawnPositions(req, pokojeAktualne).then((v) => {
        res.json(v); // odsyłam pozycję samych pionków => klient zrobi resztę
      });
    } else res.redirect("/");
  });

  app.get("/nowiLudzie", (req, res) => {
    newUser(req, res, pokojeAktualne);
  });

  app.get("/gameSynch", (req, res) => {
    if (req.session.database) player.handleGame(req, res, pokojeAktualne);
    else res.redirect("/");
  });
  //kosteczka
  app.get("/throwDice", (req, res) => {
    player.throwDice(req, pokojeAktualne);
    console.log("kości zostały rzucone");
    res.sendStatus(200);
  });
  app.get("/newMove", (req, res) => {
    console.log("essa");
    player.endPawnMove(req, pokojeAktualne);
    res.sendStatus(200);
  });

  //*POST SECTION

  app.post("/askForRoom", function (req, res) {
    new user.NewUser(req.body, pokojeAktualne, res, req);
  });
  app.post("/sendToBase", function (req, res) {
    player.goToBase(req, pokojeAktualne);
    res.sendStatus(200);
  });

  app.post("/zmianaNastawienia", function (req, res) {
    whoWantsToPlay.wantToPlay(req, res, pokojeAktualne);
  });
  app.post("/newMove", function (req, res) {
    player.move(req, pokojeAktualne);
    res.sendStatus(200);
  });
  app.get("*", (req, res) => res.redirect("/"));
};
