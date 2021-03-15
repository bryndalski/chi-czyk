'use strict'
window.addEventListener('DOMContentLoaded', () => {
    createGameBord.setCanvas()
    createGameBord.resize()
    createGameBord.drawGamePath()
})
window.addEventListener("resize", () => {
    createGameBord.resize()
})

const createGameBord = {
    canvasElement: null,
    canvasContext: null,
    canvasSize: null,
    setCanvas() {
        this.canvasElement = document.querySelector('canvas')
        this.canvasContext = this.canvasElement.getContext('2d')
    },
    resize() {
        this.canvasSize = document.querySelector('.cnvContainer').getBoundingClientRect(); // położenie względem okna
        console.log(this.canvasSize.width)
        if (this.canvasSize.width > 900) {
            this.canvasSize.width = 900
            this.canvasSize.height = 900
        }
        this.canvasElement.width = this.canvasSize.width; //     Zbieram sobie rozmiar canvasa
        this.canvasElement.height = this.canvasSize.height
        this.canvasContext.scale(1, 1) //skaluje
        this.drawGamePath()

    },

    drawCircle() {

    },
    drawGamePath() {
        this.canvasContext.beginPath()
        this.canvasContext.moveTo(this.canvasSize.height * (10 / 100), this.canvasSize.height * (60 / 100));
        this.canvasContext.lineTo(this.canvasSize.height * (10 / 100), this.canvasSize.height * (40 / 100));
        this.canvasContext.lineTo(this.canvasSize.height * (40 / 100), this.canvasSize.height * (40 / 100));
        this.canvasContext.lineTo(this.canvasSize.height * (40 / 100), this.canvasSize.height * (10 / 100));
        this.canvasContext.lineTo(this.canvasSize.height * (60 / 100), this.canvasSize.height * (10 / 100));
        this.canvasContext.lineTo(this.canvasSize.height * (60 / 100), this.canvasSize.height * (40 / 100));
        this.canvasContext.lineTo(this.canvasSize.height * (90 / 100), this.canvasSize.height * (40 / 100));
        this.canvasContext.lineTo(this.canvasSize.height * (90 / 100), this.canvasSize.height * (60 / 100));
        this.canvasContext.lineTo(this.canvasSize.height * (60 / 100), this.canvasSize.height * (60 / 100));
        this.canvasContext.lineTo(this.canvasSize.height * (60 / 100), this.canvasSize.height * (90 / 100));
        this.canvasContext.lineTo(this.canvasSize.height * (40 / 100), this.canvasSize.height * (90 / 100));
        this.canvasContext.lineTo(this.canvasSize.height * (40 / 100), this.canvasSize.height * (60 / 100));
        this.canvasContext.closePath()
        this.canvasContext.stroke();
    }
}


class spaceOfGame {
    constructor(color) {
        this.color = color
    }
    resize() {

    }
}