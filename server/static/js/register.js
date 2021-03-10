import {
    serverOperation
}
from '/js/XHHTP_CLASS.js'
import {
    config
} from '/config/config.js'
const inputValues = ['nickname', "R", "G", "B"]

window.addEventListener('DOMContentLoaded', () => {
    let rangeArray = document.querySelectorAll('input[type=range]')
    rangeArray = Array.from(rangeArray)
    rangeArray.forEach(element => element.addEventListener('input', mixer))
    document.querySelector('button').addEventListener('click', enterGame)

})

function mixer() {
    let rangeArray = document.querySelectorAll('input[type=range]')
    rangeArray = Array.from(rangeArray)
    rangeArray = rangeArray.map(element => element.value)
    document.body.style.backgroundColor = `rgb(${rangeArray[0]},${rangeArray[1]},${rangeArray[2]})`
    return rangeArray
}

async function enterGame() {
    let valuesArray = Array.from(document.querySelectorAll('input'))
    let userData = {}
    let shallBeSent = true
    try {
        valuesArray.forEach((element, count) => {
            if (element.value === "")
                throw alert("Podany został pusty nick ")
            else {
                if (element.value.toString().startsWith("eval")) {
                    shallBeSent = false
                    throw alert("NOSZ KURDE NIE ŁADNIE ")
                }
                userData[inputValues[count]] = element.value
                element.value
            }
        })
    } catch (err) {}
    console.log(userData)
    if (shallBeSent) {
        let serverRequest = new serverOperation(null, userData, config.ask_for_room, "BŁĄÐ ZAPYTANIA O POKÓJ") //TODO zmień mnie 
        let respond = await serverRequest.sendData()
        await respondHandler(await respond)
    }
}


function respondHandler(respond) {
    console.log(respond)
    if (respond.redirect) {
        window.localStorage.setItem("roomId", respond.roomId)
        window.location.href = "/poczekalnia"
    } else {
        document.querySelector('span').innerHTML = respond.message
    }

}