import React, { useState } from "react"
import "../styles/Questions.css"
import { nanoid } from "nanoid"
import { decode } from "html-entities"

const Questions = ({
  question,
  answers,
  onHandleSelectedAnswer,
  isInCorrect,
  selectedAnswer,
}) => {
  const renderInputs = answers.map((answer) => {
    const inCorrectStyle = isInCorrect && answer === question
    const selectedStyle = selectedAnswer === answer ? "selected" : ""
    return (
      <input
        className={`answer--btn ${selectedStyle}`}
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
