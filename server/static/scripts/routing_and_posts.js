const user = require('./addToRoom')
module.exports = function (app, path, dirname, pokojeAktualne) {
    let inGame = false
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
        let beczka = new user.NewUser(req.body, pokojeAktualne, res, req)
    })

    app.post('/zmianaNastawienia', function (req, res) {
        console.log(req.body.change);
        if (!req.body.change) {
            pokojeAktualne.update({
                _id: req.session.database._id
            }, {
                $pull: {
                    whoWantsToPlay: req.session.whoAmI.nickname
                }
            }, {}, function (data) {
                console.log(data);
            });
        } else {
            pokojeAktualne.update({
                _id: req.session.database._id
            }, {
                $push: {
                    whoWantsToPlay: req.session.whoAmI.nickname
                }
            }, {}, function (er, data) {
                console.log(data);
            });
        }
        pokojeAktualne.findOne({
            _id: req.session.database._id
        }, function (er, data) {
            console.log(data)
            req.session.database = data
        })
    })


}