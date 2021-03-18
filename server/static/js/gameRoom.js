'use strict'
export {
    gamePRCT,
    domki,
    createGameBord
}

export const pozycjePodstawowe = [
    [5, 40], // 9
    [60, 5], // 12
    [95, 60], //3
    [40, 95], // 6
]

const gamePRCT = [
    [5, 60],
    [5, 50],
    [13, 40],
    [22, 40],
    [31, 40],
    [40, 40],
    //
    [40, 32],
    [40, 23],
    [40, 14],
    [40, 5],
    [50, 5],
    // 14 23 32 40
    [60, 14],
    [60, 23],
    [60, 32],
    [60, 40],
    // 
    [69, 40],
    [78, 40],
    [86, 40],
    [95, 40],
    [95, 50],
    //
    [86, 60],
    [78, 60],
    [69, 60],
    [60, 60],
    [60, 69],
    //
    [60, 78],
    [60, 87],
    [60, 95],
    [50, 95],
    //
    [40, 87],
    [40, 78],
    [40, 69],
    //
    [13, 60],
    [22, 60],
    [31, 60],
    [40, 60],
]

const domki = [ //te śmieszne na środku
    // na 9
    [
        [13, 50],
        [22, 50],
        [31, 50],
        [40, 50],
    ],
    //na 12
    [
        [50, 40],
        [50, 32],
        [50, 23],
        [50, 14],
    ],
    // na 3 
    [
        [60, 50],
        [69, 50],
        [78, 50],
        [86, 50],
    ],
    // na 6
    [
        [50, 87],
        [50, 78],
        [50, 69],
        [50, 60],
    ]
]

const bazy = [
    [
        [5, 5],
        [5, 14],
        [13, 5],
        [13, 14]
    ],
    [
        [85, 5],
        [85, 14],
        [93, 5],
        [93, 14]
    ],
    [
        [95, 95],
        [95, 87],
        [87, 95],
        [87, 87]
    ],
    [
        [5, 95],
        [5, 87],
        [13, 95],
        [13, 87]
    ],

]

const createGameBord = {
    canvasElement: null,
    canvasContext: null,
    canvasSize: null,
    cordsArray: [],
    userArray: [],
    setCanvas() {
        this.canvasElement = document.querySelector('canvas')
        this.canvasContext = this.canvasElement.getContext('2d')
    },

    resize() {
        this.canvasSize = document.querySelector('.cnvContainer').getBoundingClientRect(); // położenie względem okna
        if (this.canvasSize.width > 900) {
            this.canvasSize.width = 900
            this.canvasSize.height = 900
        }
        this.canvasElement.width = this.canvasSize.width; //     Zbieram sobie rozmiar canvasa
        this.canvasElement.height = this.canvasSize.height
        this.canvasContext.scale(1, 1) //skaluje
        this.drawGamePath()
        gamePRCT.forEach(elem => this.drawFiled(this.canvasSize.height * (elem[0] / 100), this.canvasSize.height * (elem[1] / 100), this.canvasSize.height * (3 / 100), 'rgb(0,0,0,0.3)', "rgb(0,0,0,0.3)"))
        this.drawHomes()
        this.drawBasicPositons()
        this.drawHugeHomes()
    },

    drawCircle(x, y, srednica, color, text) {
        this.canvasContext.clearRect(x, y, srednica, srednica)
        this.canvasContext.beginPath()
        this.canvasContext.arc(x, y, srednica, 0, 2 * Math.PI)
        this.canvasContext.stroke()
        this.canvasContext.fillStyle = color
        if (text)
            this.canvasContext.fillText("Hello World!", x, y, srednica / 2);
        this.canvasContext.fill()
    },
    drawFiled(x, y, srednica, incolor, outcolor) {
        this.canvasContext.clearRect(x, y, srednica, srednica)
        this.canvasContext.beginPath()
        this.canvasContext.arc(x, y, srednica, 0, 2 * Math.PI)
        this.canvasContext.stroke()
        let gradient = this.canvasContext.createRadialGradient(x, y, srednica / 15, x, y, srednica);
        gradient.addColorStop(0, incolor);
        gradient.addColorStop(1, outcolor);
        this.canvasContext.fillStyle = gradient
        this.canvasContext.fill()
    },
    drawGamePath() {
        this.canvasContext.beginPath() //                   XXXXXXXX                              YYYYYYYY
        this.canvasContext.moveTo(this.canvasSize.height * (5 / 100), this.canvasSize.height * (60 / 100));
        this.canvasContext.lineTo(this.canvasSize.height * (5 / 100), this.canvasSize.height * (40 / 100));
        this.canvasContext.lineTo(this.canvasSize.height * (40 / 100), this.canvasSize.height * (40 / 100));
        this.canvasContext.lineTo(this.canvasSize.height * (40 / 100), this.canvasSize.height * (5 / 100));
        this.canvasContext.lineTo(this.canvasSize.height * (60 / 100), this.canvasSize.height * (5 / 100));
        this.canvasContext.lineTo(this.canvasSize.height * (60 / 100), this.canvasSize.height * (40 / 100));
        this.canvasContext.lineTo(this.canvasSize.height * (95 / 100), this.canvasSize.height * (40 / 100));
        this.canvasContext.lineTo(this.canvasSize.height * (95 / 100), this.canvasSize.height * (60 / 100));
        this.canvasContext.lineTo(this.canvasSize.height * (60 / 100), this.canvasSize.height * (60 / 100));
        this.canvasContext.lineTo(this.canvasSize.height * (60 / 100), this.canvasSize.height * (95 / 100));
        this.canvasContext.lineTo(this.canvasSize.height * (40 / 100), this.canvasSize.height * (95 / 100));
        this.canvasContext.lineTo(this.canvasSize.height * (40 / 100), this.canvasSize.height * (60 / 100));
        this.canvasContext.closePath()
        this.canvasContext.stroke();
    },
    drawHomes() {
        domki.forEach((el, cnt) => {
            if (this.userArray[cnt])
                el.forEach(elem => createGameBord.drawCircle(createGameBord.canvasSize.height * (elem[0] / 100), this.canvasSize.height * (elem[1] / 100), this.canvasSize.height * (3 / 100), `rgb(${this.userArray[cnt].R},${this.userArray[cnt].G},${this.userArray[cnt].B},0.2)`))
            else
                el.forEach(elem => this.drawFiled(this.canvasSize.height * (elem[0] / 100), this.canvasSize.height * (elem[1] / 100), this.canvasSize.height * (3 / 100), "red", "black"))
        })
    },
    drawBasicPositons() {
        pozycjePodstawowe.forEach((elem, cnt) => {
            if (this.userArray[cnt])
                createGameBord.drawFiled(createGameBord.canvasSize.height * (elem[0] / 100), this.canvasSize.height * (elem[1] / 100), this.canvasSize.height * (3 / 100), `rgb(${this.userArray[cnt].R},${this.userArray[cnt].G},${this.userArray[cnt].B},1.5)`, "rgb(51,51,51)")
            else
                this.drawFiled(this.canvasSize.height * (elem[0] / 100), this.canvasSize.height * (elem[1] / 100), this.canvasSize.height * (3 / 100), "red", "rgb(0,0,0,0.5)")
        })

    },
    drawHugeHomes() {
        bazy.forEach((elem1, counter) => elem1.forEach(elem => {
            console.log(elem);
            if (this.userArray[counter])
                createGameBord.drawCircle(createGameBord.canvasSize.height * (elem[0] / 100), this.canvasSize.height * (elem[1] / 100), this.canvasSize.height * (3 / 100), `rgb(${this.userArray[counter].R},${this.userArray[counter].G},${this.userArray[counter].B})`)
            else
                this.drawFiled(this.canvasSize.height * (elem[0] / 100), this.canvasSize.height * (elem[1] / 100), this.canvasSize.height * (3 / 100), "red", "black")
        }))
    }
}