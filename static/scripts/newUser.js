module.exports = function (req, res, pokojeAktualne) {
    pokojeAktualne.findOne({
        _id: req.session.database._id
    }, function (error, document) {
        req.session.database = document
        let time = new Date().getTime() + 5000
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
            }, function (err, numReplaced) {});
            if (req.session.database.syncTime == 0) {
                pokojeAktualne.update({
                    _id: req.session.database._id
                }, {
                    $set: {
                        syncTime: time //          Blokowanie pokoju gdy 2 osoby chca grać pokój przestaje być dostępny 
                    }
                }, {
                    multi: true
                }, function (err, numReplaced) {});
            }
        }
        res.json({
            players: [...document.players],
            whoAmI: req.session.whoAmI,
            whoWantsToPlay: req.session.database.whoWantsToPlay,
            synchTime: (req.session.database.syncTime == 0) ? time : req.session.database.syncTime
        })
    })
}