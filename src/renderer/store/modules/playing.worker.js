let player

onmessage = ({action,value}) => {
    switch(action){
        case "init":
            player = new value()
            break
        case "volume":
            player.volume = value
            console.log(value)
            break
        case "song":
            player.src = value
        default:
    }
}