import "./flashcard.css";
import { LuEyeOff, LuLightbulb } from "react-icons/lu";
import { LuEye } from "react-icons/lu";
import { useContext, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { GlobalState } from "../../App";
import { useNavigate } from "react-router-dom";

export default function flashcard() {
  const [showAnswer, setShowAnswer] = useState(false);
  const navigate = useNavigate();
  const { flashCardData, setFlashCardData, setShowFlashcard } =
    useContext(GlobalState);
  console.log(flashCardData);
  const [cardNo, setCardNo] = useState(1);
  let frontClass = ["flashcard-container_front", "show-front"];
  let backClass = ["flashcard-container_back", "hide-back"];

  if (showAnswer) {
    backClass = ["flashcard-container_back", "show-back"];
    frontClass = ["flashcard-container_front", "hide-front"];
  }
  return (
    <section className="flashcard">
      <div
        className="icon-back"
        onClick={() => {
          setShowFlashcard(false);
          navigate("/Upload");
        }}
      >
        <FaArrowLeft
          color="white"
          size={30}
          style={{ zIndex: "4", position: "absolute" }}
        />
      </div>
      <div className="flashcard-container">
        <div className={frontClass.join(" ")}>
          <div className="front-layout">
            <div className="front">Front</div>
            <p className="flashcard-covered">
              {cardNo}/{flashCardData?.flashcards?.length}
            </p>
          </div>

          <p className="flashcard-question">
            {flashCardData?.flashcards &&
              flashCardData?.flashcards[cardNo]?.question}
          </p>

          <div className="answer-guide">
            <LuLightbulb
              color="#9857ff"
              size={22}
              style={{ marginRight: ".51rem" }}
            />{" "}
            Click "Show Answer" to see the answer
          </div>
        </div>
        <div className={backClass.join(" ")}>
          <div className="front-layout">
            <div className="back">Back</div>
          </div>

          <p className="explanation-head">Explanation</p>
          <p className="flashcard-explanation">
            {flashCardData?.flashcards &&
              flashCardData?.flashcards[cardNo].answer}
          </p>
        </div>
      </div>

      <div className="flashcard-button_container">
        <div
          className="flashcard_button"
          onClick={() => {
            if (cardNo === 0) {
              return;
            }
            setShowAnswer(false);
            setCardNo((prevCardNo) => prevCardNo - 1);
          }}
        >
          <FaArrowLeft color="#9857ff" style={{ cursor: "pointer" }} />
        </div>
        <div
          className="flashcard_button"
          onClick={() => {
            setShowAnswer(false);
            if (cardNo < flashCardData?.flashcards.length - 1)
              setCardNo((prevCardNo) => prevCardNo + 1);
            else {
              setFlashCardData(null);
              setShowFlashcard(false);
              navigate("/Upload");
            }
          }}
        >
          {cardNo + 1 === flashCardData?.flashcards?.length ? (
            "exit"
          ) : (
            <FaArrowRight color="#9857ff" style={{ cursor: "pointer" }} />
          )}
        </div>
      </div>
      <div
        className="answer-button"
        onClick={() => {
          setShowAnswer((prevShowAnswer) => !prevShowAnswer);
        }}
      >
        {!showAnswer ? (
          <LuEye color="#9857ff" size={30} style={{ marginRight: ".5rem" }} />
        ) : (
          <LuEyeOff
            color="#9857ff"
            size={30}
            style={{ marginRight: ".5rem" }}
          />
        )}
        {!showAnswer ? "Show Answer" : "Hide Answer"}
      </div>
    </section>
  );
}
