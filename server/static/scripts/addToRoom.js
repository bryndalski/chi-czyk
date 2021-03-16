const dbSchema = require('../config/db_schema.json')
class NewUser {
    constructor(user, database, res, req) {
        this.req = req
        this.res = res
        this.user = user
        this.database = database
        this.INIT()
    }
    //initialization
    async INIT() {
        const room = await this.findRoom()
        if (await room === null) {
            this.newRoom().then(value => {
                this.addUserToRoom(value)
                this.req.session.waiting = true
                this.req.session.database = value
                this.req.session.whoAmI = this.user
                this.res.json({
                    success: true,
                    redirect: true,
                })
            })
        } else {
            const uniqResponse = await this.uniqueCheck(room) || true
            console.log(await uniqResponse)
            if (uniqResponse.success) {
                this.addUserToRoom(room)
                this.req.session.waiting = true
                this.req.session.database = room
                this.req.session.whoAmI = this.user
                this.res.json({
                    success: true,
                    redirect: true,
                })
            } else this.res.json(uniqResponse)
        }

    }
    //methods
    async findRoom() {
        let dbConnect = await new Promise((success, fail) => {
            this.database.findOne({
                roomOccupants: {
                    $lt: 4
                }
            }, function (error, document) {
                success((document === null) ? null : document)
            })
        })
        return dbConnect
    }
    async newRoom() {
        let newRoom = await new Promise((success, fail) => {
            this.database.insert(dbSchema,
                function (error, document) {
                    success(document)
                })
        })
        return newRoom
    }
    uniqueCheck(room) {
        let allPlayers = []
        room.players.forEach(element => { // zmieniam sobei wszyskie kolory na stringa bo jestem leiwy i potrzebuję porównać unikalne dla pokoju 
            allPlayers.push(`${element.R}${element.G}${element.B}`)
            allPlayers.push(element.nickname)
        });
        if (allPlayers.includes(`${this.user.R}${this.user.G}${this.user.B}`) || allPlayers.includes(this.user.nickname)) return {
            success: false,
            message: `Twój nick lub kolor musi zostać zmieniony 
            Lets Play A game :)
            `
        }
        else {
            return {
                success: true,
                roomId: room._id
            }
        }
    }

    async addUserToRoom(room) {
        this.user.id = room.roomOccupants + 1
        room.roomOccupants = room.roomOccupants + 1
        let userData = room.players
        userData.push(this.user)
        this.database.update({
                _id: room._id
            }, {
                $set: {
                    roomOccupants: room.roomOccupants,
                },
                $push: {
                    players: this.user
                }
            }, {}, // this argument was missing
            (err, numReplaced) => {
                this.database.persistence.compactDatafile() //czyści DB 
            }
        );
    }
}


module.exports = {
    NewUser
}