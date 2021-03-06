#! /usr/bin/env node

let correct = 0
const operator = () => {
  return ['+', '-', '×', '÷']
}

async function exsamplequiz () {
  console.log('30秒以内に10問答えてね！')
  const { Quiz } = require('enquirer')
  const exsample = new Quiz({
    type: 'quiz',
    message: '例題だよ！　以下の □ に入る記号を選んでね！\n4 □ 6 = 10',
    choices: operator(),
    correctChoice: 0
  })
  await exsample
    .run()
    .then(answer => {
      if (answer.correct) {
        console.log('正解！')
      } else {
        console.log('不正解！答えは + だよ！')
      }
    })
    .catch(console.error)

  console.log('始まるよー！')
  for (let i = 3; i >= 0; i--) {
    await display(i > 0 ? i : 'GO!')
  }
}

const display = (value) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(value)
      resolve()
    }, 1000)
  })
}

const createQuizMessage = () => {
  const num1 = ramdomNumber(1, 10)
  const num2 = ramdomNumber(3, 10)
  let answer
  let operatorNumber
  do {
    operatorNumber = ramdomNumber(0, 4)
    switch (operatorNumber) {
      case 0:
        answer = num1 + num2
        break
      case 1:
        answer = num1 - num2
        break
      case 2:
        answer = num1 * num2
        break
      case 3:
        answer = num1 / num2
        break
    }
  } while (answer < 0 || !Number.isInteger(answer))
  return { message: `以下の □ に入る記号を選んでね！\n${num1} □ ${num2} = ${answer}`, correct: operatorNumber }
}

const ramdomNumber = (max, min) => {
  return Math.floor(Math.random() * (max - min) + min)
}

function createQuiz () {
  const quiz = createQuizMessage()
  return {
    type: 'select',
    message: quiz.message,
    choices: operator(),
    result (answer) {
      if (operator().indexOf(answer) === quiz.correct) {
        correct++
        console.log('正解！')
      } else {
        console.log('不正解！')
      }
    }
  }
}

const createArrQuiz = (numberOfProblems) => {
  const arrquiz = []
  for (let i = 1; i <= numberOfProblems; i++) {
    const quiz = createQuiz()
    arrquiz.push(quiz)
  }
  return arrquiz
}

const calcscore = (numberOfProblem, correctNumber, time) => {
  let score = time * correctNumber
  if (correctNumber === numberOfProblem) {
    score += 500
  }
  return Math.floor(score)
}

async function main () {
  await exsamplequiz()
  const remainingTime = 30.0
  const numberOfProblem = 10
  let count = remainingTime
  const starttime = new Date()
  let endtime
  let currentPrompt
  let interval

  const Enquirer = require('enquirer')
  const enquirer = new Enquirer()
  enquirer.on('prompt', (prompt) => {
    currentPrompt = prompt
    prompt.once('run', () => {
      interval = setInterval(() => {
        count -= 0.1
        if (count <= 0) {
          currentPrompt.cancel()
          endtime = new Date()
        } else {
          currentPrompt.render()
        }
      }, 100)
    })
    prompt.once('close', () => {
      clearInterval(interval)
      endtime = new Date()
    })
  })

  const quizzes = createArrQuiz(numberOfProblem)
  await enquirer.prompt(quizzes).catch(console.error)
  console.log('終了！')
  const elapsedTime = Math.floor((endtime - starttime) / 100) / 10
  let time = Math.floor((remainingTime - elapsedTime) * 10) / 10
  if (time < 0) { time = 0 }
  console.log(`正解数${correct}! 残り時間${time}秒!`)
  console.log(`あなたのスコアは${calcscore(numberOfProblem, correct, time)}です！`)
}

exports.main = main
