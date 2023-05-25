import React from "react"
import "../styles/Modal.css"

export const Modal = ({
  score,
  onPlayAgainClick,
  questionLength,
  onCloseModalClick,
  isModal,
}) => {
  return (
    <section
      className={`modal--container ${isModal ? "open" : "close"}`}
      style={{ display: isModal ? "" : "none" }}
    >
      <h3 className="close--btn" onClick={onCloseModalClick}>
        X
      </h3>
      <div className="score--display">
        <h3 className="score--tally">
          Your score: {score}/{questionLength}
        </h3>
        {score === questionLength && <p>Wow you're a trivia master! ƪ(˘⌣˘)ʃ</p>}
        {score >= questionLength / 2 && score < questionLength && (
          <p>Aww so close! Better luck next time🤷‍♂️</p>
        )}
        {score < questionLength / 2 && <p>Better luck next time.. o(TヘTo)</p>}
      </div>
      <button className="playagain--btn" onClick={onPlayAgainClick}>
        Play Again
      </button>
    </section>
  )
}
