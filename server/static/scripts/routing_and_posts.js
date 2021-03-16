const user = require('./addToRoom')
const whoWantsToPlay = require('./whoWantsToPlay')
module.exports = function (app, path, dirname, pokojeAktualne) {
    //* ROUTE section
    app.get('/', (req, res) => {
        console.log(req.session.database);
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
        else
        if (req.session.waiting)
            res.redirect("/poczekalnia")
        else
            res.sendFile(path.join(dirname, "/static/pages/game.html"))

    })
    app.get('/GetUsers', (req, res) => {
        if (req.session)
            pokojeAktualne.findOne({
                _id: req.session.database._id
            }, function (error, document) {
                req.session.database = document
                res.json({
                    players: [...document.players],
                    whoAmI: req.session.whoAmI,
                })
            })

    })



    app.get('/nowiLudzie', (req, res) => {
        pokojeAktualne.findOne({
            _id: req.session.database._id
        }, function (error, document) {
            req.session.database = document
            if (req.session.database.whoWantsToPlay.length >= 2) {
                req.session.waiting = false
                pokojeAktualne.update({
                    _id: req.session.database._id
                }, {
                    $set: {
                        roomOccupants: 4 //          Blokowanie pokoju gdy 2 osoby chca grać pokój przestaje być dostępny 
                    }
                }, {
                    multi: true
                }, function (err, numReplaced) {});;
            }
            res.json({
                players: [...document.players],
                whoAmI: req.session.whoAmI,
                whoWantsToPlay: req.session.database.whoWantsToPlay
            })
        })
    })


    //*POST SECTION

    app.post('/askForRoom', function (req, res) {
        new user.NewUser(req.body, pokojeAktualne, res, req)
    })

    app.post('/zmianaNastawienia', function (req, res) {
        whoWantsToPlay.wantToPlay(req, res, pokojeAktualne)
    })




}