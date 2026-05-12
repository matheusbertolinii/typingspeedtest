const startBtn = document.getElementById("startBtn")
const startupArea = document.querySelector(".challenge-area-startup")
const challengeTextArea = document.querySelector(".challenge-textarea")
const restartBtn = document.querySelector(".restart-container")

async function handleRandomText(difficulty) {
    const res = await fetch('./data.json')
    const data = await res.json()

    let rnumber = Math.floor(Math.random() * data[difficulty].length)

    let challengeText = challengeTextArea.placeholder = data[difficulty][rnumber].text

    return challengeText
}

function handleDifficulty() {
    const input = document.querySelector("input[name='difficulty']:checked")
    return input.id
}

async function handlePlaceholder(difficulty) {
    const divPlaceholder = document.querySelector(".fake-placeholder")
    divPlaceholder.textContent = await handleRandomText(difficulty)
}


function handleStartGame() {
    startupArea.classList.add("lg-hide", "sm-hide")
    challengeTextArea.classList.remove("blur")
    challengeTextArea.disabled = false
    challengeTextArea.textContent = ""
    challengeTextArea.focus()
    restartBtn.classList.remove("hide")

    handlePlaceholder(handleDifficulty())
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
restartBtn.addEventListener("click", handleStartGame)