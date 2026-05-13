const startBtn = document.getElementById("startBtn")
const startupArea = document.querySelector(".challenge-area-startup")
const challengeArea = document.querySelector(".challenge-area")
const challengeTextArea = document.querySelector(".challenge-textarea")
const restartBtn = document.querySelector(".restart-container")
const spanContainer = document.querySelector(".span-container")
const fakePlaceholder = document.querySelector(".fake-placeholder")


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

function handleDifficulty() {
    const input = document.querySelector("input[name='difficulty']:checked")
    return input.id
}

async function handlePlaceholder(difficulty) {
    const divPlaceholder = document.querySelector(".fake-placeholder")
    divPlaceholder.textContent = await handleRandomText(difficulty)
    return divPlaceholder.textContent
}

let input = ''

function backspace(event, index) {
    if (event.keyCode == 8) {
        placeholderSpan[index].style.color = "inherit"
        placeholderSpan[index].classList.remove("actual")
        placeholderSpan[index + 1].classList.remove("actual")
    }
}

async function handleHits() {

    let placeholder = [...await handlePlaceholder(handleDifficulty())]
    fakePlaceholder.textContent = ''
    placeholder.forEach(el => {
        const span = document.createElement("span")
        span.textContent = el
        fakePlaceholder.appendChild(span)
    })
    const placeholderSpan = document.querySelectorAll(".fake-placeholder span")
    placeholderSpan[0].classList.add("actual")

    challengeTextArea.addEventListener("input", function changeColor() {
        input = this.value
        spanContainer.textContent = ''
        input.split('').forEach((el, index = 0) => {
            const span = document.createElement("span")
            span.textContent = el
            backspace(event, index)
            if (index == placeholderSpan.length - 1) {
                placeholderSpan[index].classList.remove("actual")
            } else {
                placeholderSpan[index].classList.remove("actual")
                placeholderSpan[index + 1].classList.add("actual")
            }

            if (span.textContent === placeholderSpan[index].textContent) {
                span.classList.add("correct")
                placeholderSpan[index].style.color = "transparent"
            } else if (span.textContent !== placeholderSpan[index].textContent) {
                span.classList.add("wrong")
                placeholderSpan[index].style.color = "transparent"
                span.textContent = placeholderSpan[index].textContent
            }
            spanContainer.appendChild(span)
        })
    })
    // challengeTextArea.addEventListener("keydown", backspace(event, index))
}

challengeArea.addEventListener("click", () => challengeTextArea.focus())

function handleRestart() {
    challengeTextArea.focus()
    challengeTextArea.value = ''
    spanContainer.replaceChildren()
    fakePlaceholder.replaceChildren()

    handleStartGame()
}


function handleStartGame() {
    startupArea.classList.add("lg-hide", "sm-hide")
    challengeTextArea.classList.remove("blur")
    challengeTextArea.disabled = false
    challengeTextArea.textContent = ""
    challengeTextArea.focus()
    restartBtn.classList.remove("hide")

    handlePlaceholder(handleDifficulty())
    handleHits()
}

/*"input" > compare the strings
    if wrong
        color red
        swaps with right letter
    if right green
        color green
    the .value[index] works on textarea
*/

startBtn.addEventListener("click", handleStartGame)
restartBtn.addEventListener("click", handleRestart)