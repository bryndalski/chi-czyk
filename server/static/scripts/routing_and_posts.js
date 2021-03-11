const user = require('./addToRoom')
const whoWantsToPlay = require('./whoWantsToPlay')
module.exports = function (app, path, dirname, pokojeAktualne) {
    //* ROUTE section
    app.get('/', (req, res) => {
        res.sendFile(path.join(dirname + "/static/pages/setUp.html"))
    })


    app.get('/poczekalnia', (req, res) => {
        res.sendFile(path.join(dirname + "/static/pages/waitingRoom.html"))
    })
    app.get('/nowiLudzie', (req, res) => {
        pokojeAktualne.findOne({
            _id: req.session.database._id
        }, function (error, document) {
            req.session.database = document
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