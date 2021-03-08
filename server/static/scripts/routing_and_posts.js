const user = require('./addToRoom')
module.exports = function (app, path, dirname, pokojeAktualne) {
    //* ROUTE section

    app.get('/', (req, res) => {
        res.sendFile(path.join(dirname + "/static/pages/setUp.html"))
    })


    app.get('/test', (req, res) => {
        res.sendFile(path.join(dirname + "/static/pages/waitingRoom.html"))
    })

    //*POST SECTION

    app.post('/askForRoom', function (req, res) {
        let beczka = new user.NewUser(req.body, pokojeAktualne, res)
    })

}