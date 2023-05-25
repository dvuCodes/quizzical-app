import React, { useState, useEffect } from "react"
import blob1 from "./assets/blob 1.png"
import blob2 from "./assets/blob 2.png"
import Questions from "./components/Questions"
import { Modal } from "./components/Modal"
import Confetti from "react-confetti"
import shuffle from "./utils/shuffle"
import openTdbApi from "./utils/api"
import { nanoid } from "nanoid"
import { decode } from "html-entities"

// API :https://opentdb.com/api_config.php

function App() {
  const [isStart, setIsStart] = useState(false)
  const [questions, setQuestions] = useState([])
  const [fetchError, setfetchError] = useState(null)
  const [isPerfect, setIsPerfect] = useState(false)
  const [score, setScore] = useState(0)
  const [isRendering, setIsRendering] = useState(true) //Using this state to disable buttons when questions are rendering
  const [gameOver, setgameOver] = useState(false)
  const [isModal, setIsModal] = useState(false)

  // function to fetch trivia questions
  const fetchData = async () => {
    try {
      const res = await fetch(openTdbApi)
      if (!res.ok) {
        throw new Error("Failed to fetch data")
      }
      const fetchData = await res.json()
      if (!gameOver) {
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
      }
    } catch (err) {
      console.log("Error fetching data:", err)
      setfetchError("Unable to generate questions. Please try again.")
    }
  }

  // Start game click
  const onStartQuizClick = () => {
    console.log(questions)
    setIsStart(true)
  }

  // Hook to fetch API data when gameOver state is set to "false"
  useEffect(() => {
    let subscribe = true
    if (!gameOver && subscribe) {
      fetchData()
    }
    setIsRendering(false)
    return () => {
      subscribe = false
    }
  }, [gameOver])

  // Finds the selected answer and sets new state with the selected answer
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
  const onCheckAnswerClick = () => {
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
      setIsModal(true)
      setIsPerfect(updatedScore === perfectScore)
      setgameOver(true)
    }, 500)

    // calculate score and checks if it's a perfect score
  }

  const onPlayAgainClick = () => {
    setIsPerfect(false)
    setgameOver(false)
  }

  // onClick function to close modal
  const onCloseModalClick = () => {
    setIsModal(false)
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
            Start Quiz
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
                <div
                  className="bottom--wrapper"
                  // style={{ position: gameOver ? "fixed" : "" }}
                >
                  {gameOver && isModal ? (
                    <Modal
                      score={score}
                      onPlayAgainClick={onPlayAgainClick}
                      onCloseModalClick={onCloseModalClick}
                      questionLength={questions.length}
                      isModal={isModal}
                    />
                  ) : (
                    <button
                      className="submit--btn"
                      disabled={isRendering}
                      style={{
                        display: isRendering ? "none" : "",
                      }}
                      onClick={onCheckAnswerClick}
                    >
                      Check {gameOver ? "Score" : "Answers"}
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
