const user = require('./addToRoom')
module.exports = function (app, path, dirname, pokojeAktualne) {
    //* ROUTE section

    app.get('/', (req, res) => {
        res.sendFile(path.join(dirname + "/static/pages/setUp.html"))
    })


    app.get('/test', (req, res) => {
        res.json({
            status: "Sucess",
            test: "Compleated",
            redirest: true
        })
    })

    //*POST SECTION

    app.post('/askForRoom', function (req, res) {
        let beczka = new user.NewUser(req.body, pokojeAktualne)
    })

}