function wantToPlay(req, res, pokojeAktualne) {
    if (!req.body.change) {
        pokojeAktualne.update({
            _id: req.session.database._id
        }, {
            $pull: {
                whoWantsToPlay: req.session.whoAmI.nickname
            }
        }, {}, function (data) {
        });
    } else {
        pokojeAktualne.update({
            _id: req.session.database._id
        }, {
            $push: {
                whoWantsToPlay: req.session.whoAmI.nickname
            }
        }, {}, function (er, data) {
        });
    }
    pokojeAktualne.persistence.compactDatafile() //czyści DB 
    pokojeAktualne.findOne({
        _id: req.session.database._id
    }, function (er, data) {
        req.session.database = data
        res.json({})
    })
}

module.exports = {
    wantToPlay
}