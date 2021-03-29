const user = require('./addToRoom')
const whoWantsToPlay = require('./whoWantsToPlay')
const newUser = require('./newUser')
const player = require("./gamePlay")
module.exports = function (app, path, dirname, pokojeAktualne) {
    //* ROUTE section
    app.get('/', (req, res) => {
        if (req.session.database == undefined)
            res.sendFile(path.join(dirname + "/static/pages/setUp.html"))
        else
        if (req.session.waiting)
            res.redirect("/poczekalnia")
        else
            res.redirect("/chinaGameplay")
    })
    app.get('/poczekalnia', (req, res) => {
        if (req.session.database == undefined)
            res.redirect("/")
        else
        if (req.session.waiting)
            res.sendFile(path.join(dirname + "/static/pages/waitingRoom.html"))
        else
            res.redirect("/chinaGameplay")
    })

    app.get("/chinaGameplay", (req, res) => {
        if (req.session.database == undefined)
            res.redirect('/')
        else {
            if (req.session.database.roomOccupants == 4) req.session.waiting = false
            if (req.session.waiting)
                res.redirect("/poczekalnia")
            else
                res.sendFile(path.join(dirname, "/static/pages/game.html"))
        }
    })

    app.get('/getUsers', (req, res) => {
        res.json({
            whoAmI: req.session.whoAmI,
            players: req.session.database.players
        })
    })
    app.get('/getBord', (req, res) => {
        let toSend = player.createBasicBord(req, res, pokojeAktualne)
        res.json(toSend)
    })

    app.get('/pawnPosition', (req, res) => { //w zależności od sytuacji jeśli gra została zainicjowana odsyła albo czyste położenie początkowe albo
        console.log("pobieram pionki", req.session.pawnPosition)
        req.session.incoming = new Date().getTime()
        if (req.session.database) {
            if (!req.session.pawnPosition) {
                player.handleUserInit(req, pokojeAktualne)
                setInterval(() => {
                    player.tourMenager(req, pokojeAktualne)
                }, 1000);
                res.json(req.session.pawnPosition) //położenie aktualne pionków 
            } else {
                res.json(req.session.pawnPosition) //położenie aktualne pionków 
            }
        } else
            res.redirect("/")
    })

    app.get('/nowiLudzie', (req, res) => {
        newUser(req, res, pokojeAktualne)
    })

    app.get("/gameSynch", (req, res) => {
        if (req.session.database)
            player.handelGame(req, res, pokojeAktualne)
        else
            res.redirect("/")
    })
    //kosteczka
    app.get('/throwDice', (req, res) => {
        player.throwDice(req, pokojeAktualne)
        res.status(200)
    })


    //*POST SECTION

    app.post('/askForRoom', function (req, res) {
        new user.NewUser(req.body, pokojeAktualne, res, req)
    })

    app.post('/zmianaNastawienia', function (req, res) {
        whoWantsToPlay.wantToPlay(req, res, pokojeAktualne)
    })



}