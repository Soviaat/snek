const USERNAME = prompt("What is your name?")
let GRID = document.getElementById("grid")
// N, E, S, W
let snake = {
    0: {x:3,y:1,heading:"E"}, 1: {x:2,y:1,heading:"E"}, 2: {x:1,y:1,heading:"E"}
}
let snakeSize = 3
let highscore = 0
let maxTimeSeconds = 0
let appleX, appleY = 0
let dead = false
let inputHeading = "E"
let turnX, turnY = 0
let appleIn = false

document.getElementById("usernamefield").innerText = USERNAME

function updateHighscoreVar() {
    highscore = Number(document.cookie.split("=",2)[1])
}

function updateHighscoreCookie(hs) {
    document.cookie = `highscore=${hs};max-age=max-age-in-seconds=31536000`
}

function updateHighscoreHtml() {
    document.getElementById("highscorefield").innerText = highscore
}

let intervalTimeSeconds = 0
let timerInterval_a
function startTimer() {
    timerInterval_a = setInterval(function() {
        intervalTimeSeconds+=1
    }, 1*1000)
}

function stopTimer() {
    clearInterval(timerInterval_a)
    if (intervalTimeSeconds>maxTimeSeconds) maxTimeSeconds = intervalTimeSeconds
}

function addScore(score) {
    highscore+=score
} 

function updateSnakePosition() {
    for (let i = 0; i < snakeSize; i++) {
        let snakePiece = document.getElementsByClassName(`snek${i}`)[0]
        if (i==0) snakePiece.classList.add("snekhead")
        else snakePiece.classList.add("snekbody")
        snakePiece.style.gridRow = snake[i]["y"]
        snakePiece.style.gridColumn = snake[i]["x"]
    }
}

function generateApple() {
    if (appleIn) document.getElementById("apple").remove()
    let randomX = Math.floor(Math.random() * 20)
    let randomY = Math.floor(Math.random() * 20)
    let asd = document.getElementById("grid")
    let badgen = false
    for (let i = 0; i < snakeSize; i++) {
        if(randomX == snake[i]["x"] ||
           randomX == snake[i]["y"] || 
           randomY == snake[i]["x"] || 
           randomY == snake[i]["y"]) {
            generateApple()
            badgen = true
            break
        }
    }
    if (!badgen) {
        let apple = asd.appendChild(document.createElement("div"))
        apple.id = "apple";
        appleY = randomY
        appleX = randomX
        apple.style.gridRow = appleY
        apple.style.gridColumn = appleX
        appleIn = true
    }
}

function updateTimeHtml() {
    let min = 0
    let sec = 0
    if (intervalTimeSeconds => 60) min = Math.round(intervalTimeSeconds/60)
    sec = Math.round(intervalTimeSeconds-(min*60))
    document.getElementById("timefield").innerText = (min<10 ? "0" : "") + `${min}:` + (sec<10 ? "0" : "") + `${sec}`
}

function heading(heading) {
    inputHeading = heading
    turnX = snake[0]["x"]
    turnY = snake[0]["y"]
}

function allSameHeading() {
    let same = true
    for (let i = 0; i < snakeSize; i++) {
        for (let j = 0; i < snakeSize; j++) {
            if (i==j) continue
            if (snake[i]["heading"] != snake[j]["heading"]) {
                same = false
                break
            }
        }
    }
    return same
}

function moveSnake() {
    let head = snake[0]
    let headX = head["x"]
    let headY = head["y"]
    let headHeading = head["heading"]
    if (inputHeading=="N" && headY-1<1 ||
    inputHeading == "E" && headX+1>20 ||
    inputHeading == "S" && headY+1>20 ||
    inputHeading == "W" && headY-1<1) {
        dead = true
        return
    } else {
        for (let i = 0; i < snakeSize; i++) {
            if (snake[i]["x"] == turnX && snake[i]["y"] == turnY) {
                snake[i]["heading"] = inputHeading
            }
            switch (snake[i]["heading"]) {
                case "N":
                    snake[i]["y"] = snake[i]["y"]-1
                    break
                case "E":
                    snake[i]["x"] = snake[i]["x"]+1
                    break
                case "S":
                    snake[i]["y"] = snake[i]["y"]+1
                    break
                case "W":
                    snake[i]["x"] = snake[i]["x"]-1
                    break
                default: break
            }
            if (i == 0 && headX == appleX && headY == appleY) {
                addScore()
                generateApple()
            }
        }
    }
}

document.addEventListener('keydown', (e) => {
    console.log("press")
    console.log(e.key)
    switch (e.key) {
        case "ArrowUp":
            heading("N")
            break
        case "ArrowRight":
            heading("E")
            break
        case "ArrowDown":
            heading("S")
            break
        case "ArrowLeft":
            heading("W")
            break
        default: break
    }
})


//-------------------------------------------------

// before main game loop
updateSnakePosition()
updateTimeHtml()

// main
generateApple()
function startGame() {
    // game loop
    startTimer()
    let gameloop = setInterval(function() {
        // move snake
        moveSnake()
        updateSnakePosition()
        updateHighscoreHtml()
        updateTimeHtml()
        if (dead) {
            stopTimer()
            updateHighscoreHtml()
            updateHighscoreCookie(highscore)
            clearInterval(gameloop)
        }
    }, 500)
}

if (USERNAME == "go") startGame()
