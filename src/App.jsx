import React, { useState, useEffect } from "react"
import blob1 from "./assets/blob 1.png"
import blob2 from "./assets/blob 2.png"
import Questions from "./components/Questions"
import { nanoid } from "nanoid"
import { decode } from "html-entities"
import Confetti from "react-confetti"
import shuffle from "./utils/shuffle"
import openTdbApi from "./utils/api"

// API :https://opentdb.com/api_config.php
// TODO:
// link to firebase and create a highscore db
// allow user to choose trivia question settings

function App() {
  const [isStart, setIsStart] = useState(false)
  const [questions, setQuestions] = useState([])
  const [fetchError, setfetchError] = useState(null)
  const [isPerfect, setIsPerfect] = useState(false)
  const [score, setScore] = useState(0)
  const [isRendering, setIsRendering] = useState(true)
  const [gameOver, setgameOver] = useState(false)

  const fetchData = async () => {
    try {
      const res = await fetch(openTdbApi)
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
      setfetchError("Unable to generate questions. Please try again.")
    }
    setIsRendering(false)
  }

  // Start game click
  const onStartQuizClick = () => {
    fetchData()
    setIsStart(true)
  }

  // for testing
  useEffect(() => {
    console.log(questions)
  }, [questions])

  // Set the new state and the selected answer
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

  // map over questions add a new prop called isCorrect
  const onSubmitClick = () => {
    const perfectScore = questions.length
    let updatedScore = 0

    // loops through array to update score
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].selectedAnswer === questions[i].correct_answer) {
        updatedScore++
      }
    }

    setTimeout(() => {
      setScore(updatedScore)
      setIsPerfect(updatedScore === perfectScore)
      setgameOver(true)
    }, 1000)

    // calculate score and checks if it's a perfect score
  }

  const onPlayAgainClick = () => {
    fetchData()
    setIsPerfect(false)
    setgameOver(false)
  }

  // Render question components
  const renderQuestions = questions.map((question) => {
    return (
      <Questions
        {...question}
        gameOver={gameOver}
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
                  {isPerfect && gameOver && (
                    <h3>
                      You got a perfect score!! Your score: {score}/
                      {questions.length}
                    </h3>
                  )}
                  {!isPerfect && gameOver && (
                    <h3>
                      Try again! 🤦‍♂️ Your score: {score}/{questions.length}{" "}
                    </h3>
                  )}
                  {gameOver ? (
                    <button
                      className="playagain--btn"
                      onClick={onPlayAgainClick}
                    >
                      Play Again
                    </button>
                  ) : (
                    <button
                      className="submit--btn"
                      disabled={isRendering}
                      style={{
                        backgroundColor: isRendering ? "grey" : "#4d5b9e",
                      }}
                      onClick={onSubmitClick}
                    >
                      Check Answers
                    </button>
                  )}
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
