import React from "react"
import "../styles/Questions.css"
import { nanoid } from "nanoid"
import { decode } from "html-entities"

const Questions = ({
  question,
  answers,
  correct_answer,
  onHandleSelectedAnswer,
  selectedAnswer,
  gameOver,
}) => {
  const renderInputs = answers.map((answer) => {
    const isIncorrect =
      gameOver && selectedAnswer === answer && answer !== correct_answer
    const isCorrect = gameOver && answer === correct_answer

    // conditional styles
    const incorrectStyle = isIncorrect ? "incorrect" : ""
    const correctStyle = isCorrect ? "correct" : ""
    const selectedStyle = selectedAnswer === answer ? "selected" : ""
    return (
      <input
        className={`answer--btn ${selectedStyle} ${incorrectStyle} ${correctStyle}`}
        type="button"
        value={decode(answer)}
        key={nanoid()}
        onClick={() => onHandleSelectedAnswer(answer)}
      />
    )
  })

  return (
    <div className="wrapper">
      <h3>{question}</h3>
      <div>
        <form className="question--wrapper"> {renderInputs}</form>
      </div>
    </div>
  )
}

export default Questions
