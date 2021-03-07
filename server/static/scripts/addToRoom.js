const dbSchema = require('../config/db_schema.json')
class NewUser {
    constructor(user, database) {
        this.user = user
        this.database = database
        this.INIT()
    }
    //initialization
    async INIT() {
        const room = await this.findRoom()
        console.log(await room)
        if (await room === null) {
            this.newRoom()
        } else {
            console.log(room)
        }

    }
    //methods
    async findRoom() {
        let dbConnect = await new Promise((sucess, fail) => {
            this.database.findOne({
                roomOccupants: {
                    $lt: 4
                }
            }, function (error, document) {
                sucess((document === null) ? null : document._id)
            })
        })
        return dbConnect
    }
    newRoom() {
        this.database.insert(dbSchema,
            function (error, document) {
                console.log(document)
            })
    }
}




module.exports = {
    NewUser
}