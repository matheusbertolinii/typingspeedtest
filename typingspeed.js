const startBtn = document.getElementById("startBtn")
const restartBtn = document.querySelector(".restart")
const difficultySelector = document.querySelector(".difficulty-selector input")


const startupArea = document.querySelector(".challenge-area-startup")
const challengeArea = document.querySelector(".challenge-area")
const challengeTextArea = document.querySelector(".challenge-textarea")

const textContainer = document.querySelector(".span-container")
const placeholderContainer = document.querySelector(".fake-placeholder")

const timerDOM = document.querySelector(".timer")
const wpmDOM = document.querySelector(".wpm")
const accuracyDOM = document.querySelector(".accuracy")


difficultySelector.addEventListener("click", (e) => {
    console.log("clicked")
})

startBtn.addEventListener("click", handleStartGame)
restartBtn.addEventListener("click", handleRestart)
challengeTextArea.addEventListener("input", changeColor)
challengeTextArea.addEventListener("keydown", eventBackspace)
challengeArea.addEventListener("click", () => challengeTextArea.focus())

async function handleRandomText(difficulty) {
    try {
        const res = await fetch('./data.json')
        if (!res.ok) {
            throw new Error('Request Failed')
        }
        const data = await res.json()
        let rnumber = Math.floor(Math.random() * data[difficulty].length)

        let challengeText = data[difficulty][rnumber].text

        return challengeText
    } catch (err) {
        console.log("error")
    }
}

function handleSettings(mode) {
    const input = document.querySelector(`input[name='${mode}']:checked`)
    return input.id
}

async function chooseText(difficulty) {
    const divPlaceholder = document.querySelector(".fake-placeholder")
    divPlaceholder.textContent = await handleRandomText(difficulty)
    return divPlaceholder.textContent
}

let input = ''

function changeColor() {
    const placeholderSpan = document.querySelectorAll(".fake-placeholder span")
    placeholderSpan[0].classList.add("actual")
    input = challengeTextArea.value
    textContainer.textContent = ''
    input.split('').forEach((el, index = 0) => {
        const span = document.createElement("span")
        span.textContent = el
        if (index == placeholderSpan.length - 1) {
            placeholderSpan[index].classList.remove("actual")
        } else {
            placeholderSpan[index].classList.remove("actual")
            placeholderSpan[index + 1].classList.add("actual")
        }

        if (span.textContent === placeholderSpan[index].textContent) {
            placeholderSpan[index].classList.add("correct")
            placeholderSpan[index].classList.remove("actual")
            placeholderSpan[challengeTextArea.value.length - 1].style.removeProperty('color')

        } else if (span.textContent !== placeholderSpan[index].textContent) {
            placeholderSpan[index].classList.add("wrong")
            span.textContent = placeholderSpan[index].textContent
        }
        textContainer.appendChild(span)
    })
}




let timer

function handleTimer(time) {
    let timeLeft = time
    if (handleSettings("mode") == 'timer') {
        let minutes
        let seconds
        timer = setInterval(() => {
            wpmDOM.textContent = Math.ceil(calculateWPM(Math.abs(time - timeLeft)))
            accuracyDOM.textContent = `${calculateAccuracy().toFixed(2)}%`
            minutes = Math.floor(timeLeft / 60)
            seconds = timeLeft % 60
            if (timeLeft > 60) {
                timerDOM.textContent =
                    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
            } else {
                timerDOM.textContent =
                    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
            }
            seconds++
            finishLine(time, timeLeft)
            timeLeft--
        }, 1000)
    } else if (handleSettings("mode") == 'passage') {
        let seconds = 0
        let minutes = 0
        timer = setInterval(() => {
            wpmDOM.textContent = Math.ceil(calculateWPM(seconds))
            accuracyDOM.textContent = `${calculateAccuracy().toFixed(2)}%`

            timerDOM.textContent = `${minutes}:${seconds}`

            timerDOM.textContent =
                `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
            seconds++

            if (seconds > 60) {
                minutes++
                seconds = 0
                timerDOM.textContent =
                    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
                seconds++
            }
            finishLine(time, timeLeft)
        }, 1000)
    }

}

function finishLine(time, timeLeft) {
    if (timeLeft < 0 || !isFinished()) {
        console.log(isFinished)
        timerDOM.textContent = "STOP!"
        challengeTextArea.blur()
        challengeTextArea.disabled = true
        console.log("Time's up or finished")
        console.log("WPM: " + calculateWPM(time - timeLeft))
        console.log("Accuracy: " + calculateAccuracy())
        clearInterval(timer)
        //chamar tela de game over
    }
}

function eventBackspace(event) {
    const placeholderSpan = document.querySelectorAll(".fake-placeholder span")
    if (event.keyCode == 8) {
        placeholderSpan[challengeTextArea.value.length - 1].style.color = "inherit"
        placeholderSpan[challengeTextArea.value.length].classList.remove("actual")
        placeholderSpan[challengeTextArea.value.length - 1].classList.remove("wrong")
        placeholderSpan[challengeTextArea.value.length + 1].classList.remove("actual")
    }
}

async function createPlaceholder() {
    let placeholder = [...await chooseText(handleSettings("difficulty"))]
    // let placeholder = [...await chooseText("tests")]
    placeholderContainer.textContent = ''
    placeholder.forEach(el => {
        const span = document.createElement("span")
        span.textContent = el
        placeholderContainer.appendChild(span)
    })
}

function isFinished() {
    const textContainer = document.querySelectorAll(".span-container span")
    const placeholderSpan = document.querySelectorAll(".fake-placeholder span")

    return textContainer.length - placeholderSpan.length
}

function handleRestart() {
    textContainer.replaceChildren()
    placeholderContainer.replaceChildren()
    challengeTextArea.value = ''
    wpmDOM.textContent = "0"
    accuracyDOM.textContent = "100.00%"
    clearInterval(timer)
    handleStartGame()
}

function calculateWPM(time) {
    const textContainerSpan = document.querySelectorAll(".span-container span")
    timeSec = time / 60
    let WPM = (textContainerSpan.length / 5) / timeSec

    return WPM
}

function calculateAccuracy() {
    const placeholderSpan = document.querySelectorAll(".fake-placeholder span")
    let errors = 0
    placeholderSpan.forEach(el => {
        if (el.classList.contains("wrong")) {
            errors++
        }
    })

    let accuracy = ((placeholderSpan.length - errors) / placeholderSpan.length) * 100
    return accuracy
}

function startup() {
    startupArea.classList.add("lg-hide", "sm-hide")
    challengeTextArea.classList.remove("blur")
    challengeTextArea.disabled = false
    challengeTextArea.textContent = ""
    challengeTextArea.focus()
    restartBtn.classList.remove("hide")
    challengeArea.style.borderBottom = "1px solid color-mix(in srgb, var(--secondary-color), transparent 50%)"
    placeholderContainer.classList.remove("blur")
}

function handleStartGame() {
    startup()
    chooseText(handleSettings("difficulty"))
    // chooseText("tests")
    createPlaceholder()
    handleTimer(60)
}