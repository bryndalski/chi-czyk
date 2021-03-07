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

function enterGame() {
    let valuesArray = Array.from(document.querySelectorAll('input'))
    let valesObject = valuesArray.map(element => {
        if (element.value === "")
            throw ("Podany został pusty nick ")
        else
            return element.value
    })
    valesObject = valesObject.map((element, count) => {
        return {
            [inputValues[count]]: element
        }
    })
    console.log(valesObject)
    let serverRequest = new serverOperation(null, valesObject, config.ask_for_room, "BŁĄÐ ZAPYTANIA O POKÓJ") //TODO zmień mnie 
    serverRequest.sendData

}