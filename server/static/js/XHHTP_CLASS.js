'use strict'

import {
    config
} from "/config/config.js"

export class serverOperation {
    constructor(contentType, data, adress, errorMessage, ) {
        this.data = data || null
        this.errorMessage = errorMessage || "niestey z przyczyn niewyjaśnionych serwer się zepsuł i nie działa"
        this.adress = adress
        this.contentType = contentType || config.contentTypes.json

    }
    //getters
    get fetchData() {
        this.data = null
        let serverRequest = new XMLHttpRequest();
        serverRequest.onreadystatechange = () => {
            if (serverRequest.status === 200) {
                console.log("SEND SUCESS" + JSON.parse(serverRequest.response))
                return JSON.parse(serverRequest.response)
            } else
                return {
                    status: "error",
                    message: this.errorMessage
                }
        }
        serverRequest.open("GET", this.adress, false)
        serverRequest.send(this.data)
    }

    get sendData() {
        if (this.data == "" || this.data == null) throw "DATA CAN NOT BE NULL "
        let serverRequest = new XMLHttpRequest();
        serverRequest.open("POST", this.adress, true)
        serverRequest.setRequestHeader("Content-Type", this.contentType);
        console.log(this.adress)
        serverRequest.onreadystatechange = () => {
            if (serverRequest.status === 200 && serverRequest.readyState === XMLHttpRequest.DONE) {
                console.log("SEND SUCESS" + JSON.parse(serverRequest.response))
                return JSON.parse(serverRequest.response)
            } else
                return {
                    status: "error",
                    message: this.errorMessage
                }
        }
        console.log(this.data)
        serverRequest.send(JSON.stringify(this.data))
    }

    //methods
    changeParams(method, data, adress, errorMessage) {
        this.data = data || this.data
        this.method = method || this.method
        this.errorMessage = errorMessage || this.errorMessage
        this.adress = adress || this.adress
    }


}