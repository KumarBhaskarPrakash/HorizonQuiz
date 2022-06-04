// Get reference for the question
const question = document.getElementById('question')
const choices = Array.from(document.getElementsByClassName('choice-text'))

// Get value for questionCounter
const progressText = document.getElementById('progressText')
const scoreText = document.getElementById('score')

// Get value for progressBar
const progressBarFull = document.getElementById('progressBarFull')

// Get value for timer counter
const timerCounter = document.getElementById('timerCounter')

let currentQuestion = {}
let acceptingAnswers = false
let score = 0
let questionCounter = 0
let availableQuestions = []

// Variables for counter render
let questionTime = 10 // 10 secs for every question
let timer = null

let questions = [
  {
    question: 'Under which article was the Finance Commission of India established?',
    choice1: ' Article 260',
    choice2: ' Article 280',
    choice3: ' Article 301 ',
    choice4: ' Article 317 ',
    answer: 2
  },
  {
    question: 'Citizenship (Amendment) Bill, 2019 will amend ___',
    choice1: 'Citizenship Act, 1950',
    choice2: 'Citizenship Act, 1955 ',
    choice3: 'Citizenship Act, 1960',
    choice4: 'Citizenship Act, 1965',
    answer: 2
  },
  {
    question: 'Which State is the first to enact a law on contract farming? ',
    choice1: 'Andhra Pradesh',
    choice2: 'Uttar Pradesh',
    choice3: 'Telangana',
    choice4: 'Tamil Nadu',
    answer: 4
  },
  {
    question: 'A citizen can directly move the Supreme Court for any violation of Fundamental Rights under_____.',
    choice1: 'Article 31',
    choice2: 'Article 32',
    choice3: 'Article 33',
    choice4: 'Article 34',
    answer: 2
  },
  {
    question: 'Articles 301 to 307 deal with which of the following issue?',
    choice1: 'Public Service Commissions',
    choice2: 'Elections  ',
    choice3: 'Trade, Commerce and Intercourse within the territory of India',
    choice4: 'Right to Property',
    answer: 3
  },
  {
    question: 'Which Article stipulates that the Union has no power to make a proclamation of Financial Emergency with respect to state of Jammu and Kashmir ?',
    choice1: 'Article 378 ',
    choice2: 'Article 365',
    choice3: 'Article 370',
    choice4: 'Article 376 ',
    answer: 3
  },
  {
    question: 'Which Article is related with "Abolition of Untouchability"?',
    choice1: 'Article 20',
    choice2: 'Article 19',
    choice3: 'Article 18 ',
    choice4: 'Article 17',
    answer: 4
  },
  {
    question: 'Who decides whether a bill is a Money Bill or Not?',
    choice1: ' President',
    choice2: ' Chairmen of Rajya Sabha',
    choice3: ' Speaker of Lok Sabha',
    choice4: 'Minister of Parliamentary affairs',
    answer: 3
  },
  {
    question: 'Which one of the following is the guardian of Fundamental Rights ?',
    choice1: 'Legislature ',
    choice2: 'Executive ',
    choice3: 'Political parties ',
    choice4: 'Judiciary ',
    answer: 4
  },
  {
    question: 'The Governor of a State is appointed by the President on the advice of the',
    choice1: 'Prime Minister ',
    choice2: 'Vice- President',
    choice3: 'Chief Minister ',
    choice4: 'Chief Justice',
    answer: 1
  }
]

// CONSTANTS
const correctBonus = 10
const maxQuestions = 10

// Create audio background during gameplay
let bgm = new Audio()
bgm.src = 'audio/background.mp3'
bgm.loop = true


// Create correct & incorrect sound
let correct = new Audio()
correct.src = 'audio/correct.ogg'
let incorrect = new Audio()
incorrect.src = 'audio/incorrect.ogg'

function startGame () {
  // Play background music
  bgm.play()
  // Set up everything to default
  questionCounter = 0
  score = 0
  availableQuestions = [...questions]
  counterRender()
  timer = setInterval(counterRender, 1000)
  getNewQuestion()
}

function getNewQuestion () {
  // If there is no more question in the array or we have used max counter, stop the game
  if (availableQuestions.length === 0 || questionCounter >= maxQuestions) {
    // Clear interval of the timer
    clearInterval(timer)
    // Save the score to local storage
    localStorage.setItem('mostRecentScore', score)
    // Go to the end page
    return window.location.assign('end.html')
  }
  questionCounter++
  // Display questionCounter in HUD
  progressText.innerText = `Question ${questionCounter}/${maxQuestions}`

  // Update the progress bar
  progressBarFull.style.width = `${(questionCounter / maxQuestions) * 100}%`

  // Set the counterTimer to 5s again
  questionTime = 10

  // To make the questions randomize
  const questionIndex = Math.floor(Math.random() * availableQuestions.length)
  currentQuestion = availableQuestions[questionIndex]
  question.innerText = currentQuestion.question

  // Get the choices for that selected question
  choices.forEach(choice => {
    const number = choice.dataset['number']
    choice.innerText = currentQuestion['choice' + number]
  })
  // Remove the selected question from the list of available questions array
  availableQuestions.splice(questionIndex, 1)
  // After loading the questions, then the player can start to give the answer
  acceptingAnswers = true
}

choices.forEach(choice => {
  choice.addEventListener('click', e => {
    if (!acceptingAnswers) return
    acceptingAnswers = false

    const selectedChoice = e.target
    const selectedAnswer = selectedChoice.dataset['number']
    // If the selected answer is correct, return message
    const classToApply = Number(selectedAnswer) === Number(currentQuestion.answer) ? 'correct' : 'incorrect'

    // Add score according to the answer using if-else conditional
    if (classToApply === 'correct') {
      incrementScore(correctBonus)
      correct.play()
    } else {
      incorrect.play()
    }

    // Add class to the button
    selectedChoice.parentElement.classList.add(classToApply)

    // Set time to give a delay before we remove that class
    setTimeout(() => {
      // Remove the class after we are done
      selectedChoice.parentElement.classList.remove(classToApply)
      // After we answered the question, load a new question
      getNewQuestion()
    }, 1000)
  })
})

function incrementScore (num) {
  score += num
  scoreText.innerText = score
}

function counterRender () {
  if (questionTime >= 0) {
    timerCounter.innerHTML = `${questionTime}s`
    questionTime--
  } else {
    questionTime = 10
    getNewQuestion()
  }
}

// Start the quiz app
startGame()
