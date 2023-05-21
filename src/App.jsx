import React, { useState, useEffect } from "react"
import blob1 from "./assets/blob 1.png"
import blob2 from "./assets/blob 2.png"
import Questions from "./components/Questions"
import { nanoid } from "nanoid"
import { decode } from "html-entities"
import Confetti from "react-confetti"
import shuffle from "./utils/shuffle"

// REQUIREMENTS
// Two screens (start & questions)
// pull 5 questions from the OTDB API
// Tally correct answers after "Check answers" is clicked
// style and polish
// API :https://opentdb.com/api_config.php
// HINTS:
// API returns text in encoded in HTML entity - use a librar to decode HTML entities - https://www.npmjs.com/package/he#hedecodehtml-options or https://www.npmjs.com/package/html-entities#user-content-decodetext-options
// Shuffle items into an array to change position of answers
// Limit choice to 1 and style selected answer
// clean up imported font

// TODO
// toggle selected answer red when chosen
// find a way to update isCorrect when selecting the answer.

function App() {
  const [isStart, setIsStart] = useState(false)
  const [questions, setQuestions] = useState([])
  const [fetchError, setfetchError] = useState(null)
  const [isPerfect, setisPerfect] = useState(false)
  const [score, setScore] = useState(0)
  const [checkScore, setCheckScore] = useState(false)

  // API fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://opentdb.com/api.php?amount=5")
        if (!res.ok) {
          throw new Error("Failed to fetch data")
        }
        const fetchData = await res.json()
        const data = fetchData.results

        setQuestions((oldQuestions) =>
          data.map((question) => {
            return {
              question: decode(question.question),
              answers: shuffle([
                ...question.incorrect_answers,
                question.correct_answer,
              ]),
              correct_answer: question.correct_answer,
              selectedAnswer: "",
              id: nanoid(),
            }
          })
        )
      } catch (err) {
        console.log("Error fetching data:", err)
        setfetchError("Unable to generate questions please try again")
      }
    }
    fetchData()
  }, [])

  // Start game click
  const onStartQuizClick = () => {
    setIsStart(true)
    console.log(questions)
  }

  const onHandleSelectedAnswer = (questionId, answer) => {
    setQuestions((preState) =>
      preState.map((question) => {
        if (question.id === questionId) {
          return {
            ...question,
            selectedAnswer: answer,
            isSelected: true,
          }
        }
        return question
      })
    )
  }

  // submit answers
  const onSubmitClick = () => {
    let updatedScore = 0
    const perfectScore = questions.length

    for (let i = 0; i < questions.length; i++) {
      if (questions[i].selectedAnswer === questions[i].correct_answer) {
        updatedScore++
      }
    }

    if (updatedScore === perfectScore) {
      setisPerfect(true)
    }

    setScore(updatedScore)
    setCheckScore(true)
  }

  useEffect(() => {
    console.log("score", score)
  }, [questions])

  // render question components
  const renderQuestions = questions.map((question) => {
    return (
      <Questions
        {...question}
        key={question.id}
        onHandleSelectedAnswer={(answer) =>
          onHandleSelectedAnswer(question.id, answer)
        }
      />
    )
  })

  return (
    <main>
      <>
        {isPerfect ? <Confetti /> : ""}
        <img className="bg--img--1" src={blob1} alt="background image"></img>
        <img className="bg--img--2" src={blob2} alt="background image"></img>
      </>
      {!isStart ? (
        <>
          {" "}
          <h1 className="app--name">Quizzical</h1>
          <p>A trivial game to test your knowledge!</p>
          <button className="start--quiz--btn" onClick={onStartQuizClick}>
            Start quiz
          </button>
        </>
      ) : (
        <>
          <article>
            {fetchError ? (
              <p>{fetchError}</p>
            ) : (
              <>
                <h1>Quizzical</h1>
                {renderQuestions}
                <div className="bottom--wrapper">
                  <h3>
                    Your score {score}/{questions.length}{" "}
                  </h3>
                  <button className="playagain--btn" onClick={onSubmitClick}>
                    {checkScore ? "Play Again" : "Submit"}
                  </button>
                </div>
              </>
            )}
          </article>
        </>
      )}
    </main>
  )
}

export default App
