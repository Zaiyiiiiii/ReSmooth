let electron = require("electron")
let remote = electron.remote
let displayInfo = electron.screen.getPrimaryDisplay()
let win = remote.getCurrentWindow()
import config from "../config.json"
import { fromEvent } from 'rxjs'
import { throttleTime } from 'rxjs/operators'

let handler

// let screenWidth = displayInfo.size.width * displayInfo.scaleFactor
let offset
export class Drag {
    constructor(element) {
        this.element = element
    }

    init() {
        this.element.addEventListener("mousedown", createMouseMoveEvent(this.element))
        this.element.addEventListener("mouseup", removeMouseMoveEvent(this.element))
        console.log("init", this.element)
    }
}

function createMouseMoveEvent(element) {
    return (event) => {
        // element.addEventListener("mousemove", moveEvent)
        handler = fromEvent(element, "mousemove").subscribe(x => moveWindow(x))
        // handler
        offset = [event.clientX, event.clientY]
        console.log("event on")
    }
}

function removeMouseMoveEvent(element) {
    return (event) => {
        // element.removeEventListener("mousemove", moveEvent)
        handler.unsubscribe()
        handler = null
        console.log("event off")
    }
}

function moveWindow(event) {
    if (event.which && (event.movementX || event.movementY)) {
        let x = ( event.screenX - offset[0])
        let y = ( event.screenY - offset[1])
        console.log(event)
        console.log(x, y, win.getSize())
        win.setBounds({
            width: config.system["player-mini-width"] + config.system["player-mini-padding"]*2,
            height: config.system["player-mini-height"] + config.system["player-mini-padding"]*2,
            x: x,
            y: y
        });
        // win.setPosition(x,y)
    }
    if (!event.which) {
        handler.unsubscribe()
    }
}