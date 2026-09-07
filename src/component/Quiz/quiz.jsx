import React from "react";
import "./quiz.css";
import { LuSignal } from "react-icons/lu";
import { LuClock } from "react-icons/lu";
import { LuCircleHelp } from "react-icons/lu";
import { LuLogOut } from "react-icons/lu";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { useContext, useEffect } from "react";
import { GlobalState } from "../../App";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";

export default function Quiz() {
  const [time, setTime] = useState(null);
  const navigate = useNavigate();
  const id = nanoid();

  const {
    quizData,
    setQuizData,
    timeDone,
    setTimeDone,
    totalTime,
    setTotalTime,
    array,
    setArray,
    signinToken,
    setSignToken,
    auth,
    setAuth,
    setShowQuiz,
    setShowScore,
    showScore,
  } = useContext(GlobalState);
  console.log(array, "answered questions");

  let questions;
  let maxNo;

  if (quizData) {
    questions = quizData.questions;
    maxNo = questions?.length;
  }
  const [questionNumber, setQuestionNumber] = useState(0);
  const [userAnswer, setUserAnswer] = useState(null);
  const [selected, setSelected] = useState(null);
  const [difficulty, setDifficulty] = useState("");
  const [stop, setStop] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (!stop) {
      setTime(quizData?.quizTime);
    }
    setTotalTime(quizData?.quizTime);
    setDifficulty(quizData?.difficulty);
    setName(quizData?.name);
    setArray(quizData?.questionSchema);
  }, [quizData]); // console.log(quizData, questions);

  const min = `${Math.floor(time / 60)}`.padStart(2, "0");
  const sec = `${Math.floor(time % 60)}`.padStart(2, "0");

  // useEffect(() => {
  //   setTime(10);
  // }, []);
  useEffect(() => {
    if (time === 0) {
      setStop(true);
      setTimeDone(time);
      console.log(time);
      setShowScore(true);
      setArray((prevArray) => {
        return prevArray.map((el) => {
          return el.questionNo === questionNumber
            ? { ...el, answerSelected: selected }
            : el;
        });
      });
      navigate(`/userscore/${id}`);
    }
    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1 || stop === true) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  const prevQuestion = () => {
    if (questionNumber === 0) return;

    // Save the current question's answer before moving
    if (selected !== null) {
      setArray((prevArray) =>
        prevArray.map((el) =>
          el.questionNo === questionNumber
            ? {
                ...el,
                answerSelected: selected,
              }
            : el,
        ),
      );
    }

    const prevIndex = questionNumber - 1;

    // Find the previous question's saved answer
    const previousQuestion = array.find((el) => el.questionNo === prevIndex);

    // Move to previous question
    setQuestionNumber(prevIndex);

    // Load previous question's answer
    const previousAnswer = previousQuestion?.answerSelected || null;

    setSelected(previousAnswer);
    setUserAnswer(previousAnswer);
  };

  const nextQuestion = () => {
    if (selected === null) return;

    // Save the current question's answer
    setArray((prevArray) =>
      prevArray.map((el) =>
        el.questionNo === questionNumber
          ? {
              ...el,
              answerSelected: selected,
            }
          : el,
      ),
    );

    const nextIndex = questionNumber + 1;

    // Find the next question's saved answer
    const nextQuestionData = array.find((el) => el.questionNo === nextIndex);

    // Move to next question
    setQuestionNumber(nextIndex);

    // Load next question's previous answer, if any
    const nextAnswer = nextQuestionData?.answerSelected ?? null;

    setSelected(nextAnswer);
    setUserAnswer(nextAnswer);
  };

  return (
    <section className="quiz-section">
      <div className="quiz-container">
        <div className="quiz-details">
          <div className="quiz-progress">
            <h3>Quiz Progress</h3>
            <div className="progress-chart">
              <div className="detail">
                <div className="progress-paragraph">
                  {array?.filter((el) => el.answerSelected !== null)?.length}/
                  <span>{questions?.length}</span>
                  {/* <br /> */}
                  <p className="low">Questions</p>
                </div>
              </div>
            </div>
            <p className="percentage">
              {`${((array?.filter((el) => el.answerSelected !== null)?.length / questions?.length) * 100).toFixed(0)}%`}{" "}
              completed
            </p>
            <div className="process-bar">
              <div
                className="process-complete"
                style={{
                  width: `${(array?.filter((el) => el.answerSelected !== null)?.length / questions?.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
          <div className="quiz-info">
            <h3 className="head">Quiz Info</h3>

            <div className="quiz-list-container">
              <div className="quiz-list-item no">
                <div className="item-container">
                  <LuSignal className="icon-2" color="#9857ff" />
                  <div className="side">
                    <p>Difficulty</p>
                    <span>{difficulty}</span>
                  </div>
                </div>
              </div>
              <div className="quiz-list-item width">
                <div className="item-container">
                  {" "}
                  <LuCircleHelp className="icon-2" color="#9857ff" />
                  <div className="side">
                    <p>Question Type</p>
                    <span>Multiple choice</span>
                  </div>
                </div>
              </div>
              <div className="quiz-list-item no">
                <div className="item-container">
                  <LuClock className="icon-2" color="#9857ff" />
                  <div className="side">
                    <p>Time remaining</p>
                    <span>{`${min}:${sec}`}</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              className="exit"
              onClick={() => {
                setQuizData(null);
                setArray(null);
                setShowQuiz(false);
                navigate("/Upload");
              }}
            >
              <LuLogOut className="ml" />
              Exit Quiz
            </button>
          </div>
        </div>
        <div className="quiz-question-area">
          <div className="question">
            <div className="questions-info">
              <p className="status">
                Question{" "}
                {array?.filter((el) => el.answerSelected !== null).length} of{" "}
                {questions?.length}
              </p>
              <div className="questions-bar">
                <div
                  className="completed"
                  style={{
                    width: `${(array?.filter((el) => el.answerSelected !== null)?.length / questions?.length) * 100}%`,
                  }}
                ></div>
              </div>
              <div className="remaining-time">
                <p>{`${min}:${sec}`}</p>
                <LuClock
                  size={15}
                  color="rgb(198, 196, 196)"
                  style={{ marginLeft: ".61rem" }}
                />
              </div>
            </div>
            <div className="question-box">
              <h2 className="question-question">
                {questions ? questions[questionNumber].question : ""}
              </h2>
              <div className="question-options">
                <label className="question-option">
                  <input
                    type="radio"
                    id="question1"
                    name="question1"
                    checked={
                      selected ===
                      `${questions ? questions[questionNumber].options[0] : ""}`
                    }
                    className="question-input"
                    value={`${questions ? questions[questionNumber].options[0] : ""}`}
                    onChange={(e) => {
                      setUserAnswer(e.currentTarget.value);
                      setSelected(e.currentTarget.value);
                    }}
                  />
                  <p>
                    A){" "}
                    {`${questions ? questions[questionNumber].options[0] : ""}`}
                  </p>
                </label>
                <label className="question-option">
                  <input
                    type="radio"
                    id="question1"
                    name="question1"
                    className="question-input"
                    checked={
                      selected ===
                      `${questions ? questions[questionNumber].options[1] : ""}`
                    }
                    value={`${questions ? questions[questionNumber].options[1] : ""}`}
                    onChange={(e) => {
                      setUserAnswer(e.currentTarget.value);
                      setSelected(e.currentTarget.value);
                    }}
                  />
                  <p>
                    B)
                    {`${questions ? questions[questionNumber].options[1] : ""}`}
                  </p>
                </label>{" "}
                <label className="question-option">
                  <input
                    type="radio"
                    id="question1"
                    name="question1"
                    checked={
                      selected ===
                      `${questions ? questions[questionNumber].options[2] : ""}`
                    }
                    value={`${questions ? questions[questionNumber].options[2] : ""}`}
                    className="question-input"
                    onChange={(e) => {
                      setUserAnswer(e.currentTarget.value);
                      setSelected(e.currentTarget.value);
                    }}
                  />
                  <p>
                    C){" "}
                    {`${questions ? questions[questionNumber].options[2] : ""}`}
                  </p>
                </label>
                <label className="question-option">
                  <input
                    type="radio"
                    id="question1"
                    name="question1"
                    className="question-input"
                    value={`${questions ? questions[questionNumber].options[3] : ""}`}
                    checked={
                      selected ===
                      `${questions ? questions[questionNumber].options[3] : ""}`
                    }
                    onChange={(e) => {
                      setUserAnswer(e.currentTarget.value);
                      setSelected(e.currentTarget.value);
                    }}
                  />
                  <p>
                    D){" "}
                    {`${questions ? questions[questionNumber].options[3] : ""}`}
                  </p>
                </label>{" "}
              </div>
              <button className="previous" onClick={prevQuestion}>
                <FaArrowLeft />
              </button>
              {questions?.length -
                array?.filter((el) => el.answerSelected !== null)?.length >
              1 ? (
                <button className="next" onClick={nextQuestion}>
                  <FaArrowRight />
                </button>
              ) : (
                <button
                  className="next"
                  onClick={() => {
                    if (userAnswer === null) {
                      return;
                    }

                    const existingEl = array.find(
                      (el) => el.questionNo === questionNumber,
                    );

                    let updatedArray;

                    if (existingEl) {
                      updatedArray = array.map((el) =>
                        el.questionNo === questionNumber
                          ? {
                              ...el,
                              answerSelected: userAnswer,
                            }
                          : el,
                      );
                    }
                    // else {
                    //   updatedArray = [
                    //     ...array,
                    //     {
                    //       questionNo: questionNumber,
                    //       question: questions[questionNumber].question,
                    //       answerSelected: userAnswer,
                    //       correctAnswer: questions[questionNumber].answer,
                    //       explanation: questions[questionNumber].explanation,
                    //     },
                    //   ];
                    // }

                    // Save the complete answers array
                    setArray(updatedArray);

                    setStop(true);
                    setTimeDone(time);
                    setShowScore(true);

                    if (showScore) {
                      navigate(`/userscore/${id}`);
                    }
                  }}
                >
                  Finish
                </button>
              )}
            </div>
          </div>
          <div className="question-numbers">
            <div className="numbers">
              {questions?.map((question, num) => {
                const ele = array?.find((el) => el.questionNo === num);
                let bgCol = "#3d4961";
                if (ele && ele.answerSelected !== null) {
                  bgCol = "green";
                }
                if (num === questionNumber) {
                  bgCol = "rgb(134, 145, 199)";
                }
                return (
                  <div
                    key={num}
                    className="number"
                    style={{
                      backgroundColor: bgCol,
                    }}
                    onClick={() => {
                      const currentAnswer = array.find(
                        (el) => el.questionNo === questionNumber,
                      );

                      // Save the answer for the current question if one was selected
                      if (selected !== null) {
                        if (currentAnswer) {
                          setArray((prevArray) =>
                            prevArray.map((el) =>
                              el.questionNo === questionNumber
                                ? { ...el, answerSelected: selected }
                                : el,
                            ),
                          );
                        } else {
                          setArray((prevArray) => [
                            ...prevArray,
                            {
                              questionNo: questionNumber,
                              question: questions[questionNumber].question,
                              answerSelected: selected,
                              correctAnswer: questions[questionNumber].answer,
                              explanation:
                                questions[questionNumber].explanation,
                            },
                          ]);
                        }
                      }

                      // Go to the question that was clicked
                      setQuestionNumber(num);

                      // Load the answer previously selected for that question
                      const clickedQuestion = array.find(
                        (el) => el.questionNo === num,
                      );

                      setSelected(clickedQuestion?.answerSelected ?? null);
                      setUserAnswer(clickedQuestion?.answerSelected ?? null);
                    }}
                  >
                    {num + 1}
                  </div>
                );
              })}
            </div>
            <div className="labels">
              <div className="each">
                <div className="answered"></div>
                <p>Answered</p>
              </div>
              <div className="each">
                <div className="not-answered"></div>
                <p>Unanswered</p>
              </div>
              <div className="each">
                <div className="current"></div>
                <p>current</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
