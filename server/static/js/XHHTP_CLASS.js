'use strict'

import {
    config
} from "/config/config.js"

export class serverOperation {
    constructor(contentType, data, adress, errorMessage, ) {
        this.response = null
        this.data = data || null
        this.errorMessage = errorMessage || "niestey z przyczyn niewyjaśnionych serwer się zepsuł i nie działa"
        this.adress = adress
        this.contentType = contentType || config.contentTypes.json

    }
    //methods
    async fetchData() {
        let fetchData = await new Promise((success, fail) => {
            this.data = null
            fetch(this.adress, {
                    method: 'GET',
                })
                .then(response => response.json())
                .then(data => {
                    console.log("recived GET")
                    console.log(JSON.parse(data))
                    seccess(JSON.parse(data))
                })
                .catch((error) => {
                    return {
                        status: "error",
                        message: this.errorMessage
                    }
                });
        })
        return fetchData
    }

    async sendData() {
        if (this.data == "" || this.data == null) throw "DATA CAN NOT BE NULL "
        let fetchData = await new Promise((success, fail) => {

            fetch(this.adress, {
                    method: 'POST',
                    headers: {
                        'Content-Type': this.contentType
                    },
                    body: JSON.stringify(this.data),
                })
                .then(response => response.json())
                .then(async data => {
                    this.response = data
                    console.log(this.response)
                    success(data)
                })
                .catch((error) => {
                    return {
                        status: "error",
                        message: this.errorMessage
                    }
                });
        })
        return fetchData
    }

    get getRespond() {
        return this.response
    }

    //methods
    changeParams(method, data, adress, errorMessage) {
        this.data = data || this.data
        this.method = method || this.method
        this.errorMessage = errorMessage || this.errorMessage
        this.adress = adress || this.adress
    }



}