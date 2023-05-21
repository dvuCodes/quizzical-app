import React, { useState } from "react"
import "../styles/Questions.css"
import { nanoid } from "nanoid"

const Questions = ({
  question,
  answers,
  onHandleSelectedAnswer,
  selectedAnswer,
}) => {
  const renderInputs = answers.map((answer) => {
    const buttonClassName = selectedAnswer === answer ? "selected" : ""
    return (
      <input
        className={`answer--btn ${buttonClassName}`}
        type="button"
        value={answer}
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
