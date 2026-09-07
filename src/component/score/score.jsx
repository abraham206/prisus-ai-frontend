import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./score.css";
import { FaFilePdf, FaQrcode } from "react-icons/fa6";
import { FaFileWord } from "react-icons/fa6";
import { FaFileAlt } from "react-icons/fa";
import ProgressCircle from "../progress-circle";
import { FaCheck } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import { FaBullseye } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { useContext } from "react";
import { GlobalState } from "../../App";

// https://prisus-backend.onrender.com
export default function Score() {
  const {
    quizData,
    err,
    setErr,
    setQuizData,
    setTotalTime,
    totalTime,
    timeDone,
    setTimeDone,
    array,
    setArray,
    signinToken,
    setSigninToken,
    setShowQuiz,
    checkScore,
    setShowScore,
  } = useContext(GlobalState);

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const response = await fetch(
          "https://prisus-backend.onrender.com/api/auth/refresh",
          {
            method: "GET",
            credentials: "include",
          },
        );

        console.log(response);
        if (!response.ok) {
          setSigninToken(null);
          throw new Error(
            `Could Not get token Status Code: ${response.status}`,
          );
        }

        const data = await response.json();
        console.log(data);
        setSigninToken(data.token);
      } catch (error) {
        setSigninToken(null);
      }
    };

    refreshToken();
  }, []);

  const id = quizData?.id;
  const [data, setData] = useState(null);
  console.log(totalTime);
  console.log(array, "score");

  let questions;

  // useEffect(() => {
  //   navigate("/userpage");
  // }, []);

  if (quizData) {
    questions = quizData.questions;
  }
  const correctOne = array?.filter(
    (el) => el.answerSelected === el.correctAnswer,
  );
  const Incorrect = array?.filter(
    (el) => el.answerSelected !== el.correctAnswer,
  );
  const percent = (correctOne?.length / array?.length) * 100;
  const incorrectPercent = (Incorrect?.length / array?.length) * 100;
  let color;
  let bcColor;
  let satisfaction;
  if (percent > 75) {
    color = "rgb(11, 199, 96)";
    bcColor = "rgba(11, 199, 96, 0.18)";
    satisfaction = "Excellent";
  }

  if (percent > 50 && percent < 75) {
    color = "rgb(255, 196, 0)";
    bcColor = "rgba(255, 196, 0, 0.22)";
    satisfaction = "very good";
  }

  if (percent < 50) {
    color = "rgb(246, 71, 100)";
    bcColor = "rgba(238, 27, 62, 0.18)";
    satisfaction = "poor";
  }

  const min = `${Math.floor(timeDone / 60)}`.padStart(2, "0");
  const sec = `${Math.floor(timeDone % 60)}`.padStart(2, "0");
  const totalMin = `${Math.floor(totalTime / 60)}`.padStart(2, "0");
  const totalSec = `${Math.floor(totalTime % 60)}`.padStart(2, "0");

  const { quizId } = useParams();
  console.log(quizId);

  useEffect(() => {
    setShowQuiz(false);
  }, []);

  useEffect(() => {
    const getQuiz = async function () {
      try {
        if (checkScore) {
          let res = await fetch(
            `https://prisus-backend.onrender.com/api/get-quiz/${quizId}`,
            {
              method: "GET",
              credentials: "include",
              headers: {
                Authorization: `Bearer ${signinToken}`,
                "Content-Type": "application/json",
              },
            },
          );

          if (res.status === 401) {
            const refreshRes = await fetch(
              "https://prisus-backend.onrender.com/api/auth/refresh",
              {
                method: "GET",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
              },
            );

            if (!refreshRes.ok) {
              console.log("err");
            }
            const data = await refreshRes.json();
            setSigninToken(data.token);

            res = await fetch(
              `https://prisus-backend.onrender.com/api/get-quiz/${quizId}`,
              {
                method: "GET",
                credentials: "include",
                headers: {
                  Authorization: `Bearer ${signinToken}`,
                  "Content-Type": "application/json",
                },
              },
            );
          }
          const data = await res.json();
          if (!res.ok) {
            throw Error(`${data.message}, Status code: ${res.status}`);
          }

          console.log(data);
          setQuizData(data.quiz);
          setArray(data.quiz.answeredQuestions);
          setTotalTime(data.quiz.duration);
          setTimeDone(data.quiz.timeTaken);
        }
      } catch (error) {
        setErr(error.message);
      }
    };
    getQuiz();
  }, [checkScore]);

  const finishQuiz = async () => {
    try {
      if (!checkScore) {
        let res = await fetch(
          `https://prisus-backend.onrender.com/api/save-score/${id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${signinToken}`,
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              answeredQuestions: array,
              timeTaken: timeDone,
              percent: percent,
              incorrectPercent: incorrectPercent,
              accuracy: percent,
            }),
          },
        );

        if (res.status === 401) {
          const refreshData = await fetch(
            "https://prisus-backend.onrender.com/api/auth/refresh",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          const data = await refreshData.json();

          setSigninToken(data.token);

          res = await fetch(
            `https://prisus-backend.onrender.com/api/save-score/${id}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${signinToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                answeredQuestions: array,
                timeTaken: timeDone,
                percent: percent,
                incorrectPercent: incorrectPercent,
                accuracy: percent,
              }),
            },
          );
        }
        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.message + " " + "Status Code: " + res.status);
        }

        console.log(result);
      }
    } catch (error) {
      setErr(error.message);
    }
  };

  useEffect(() => {
    finishQuiz();
  }, []);

  const navigate = useNavigate();

  return (
    <section className="score-section">
      <div className="score-container">
        <div className="score-head">
          <span className="big">Quiz Results</span>
          <span className="small">Detailed analysis of your performance</span>
        </div>
        <div className="about-quiz-score h">
          <div className="quiz-detail-score">
            <div className="quiz-detail-about">
              <div className="document-background">
                <FaFilePdf className="score-file" />
              </div>
              <div className="quiz-score-about">
                <span className="title">{quizData?.subject}</span>
                <span className="quiz-score-features">
                  {quizData?.questions?.length} Questions . Multiple choice
                </span>
                <span className="quiz-score-date">
                  {quizData?.date} at {quizData?.time}
                </span>
              </div>
            </div>
            <div className="quiz_score">
              <ProgressCircle percentage={percent.toFixed(0)} />
              <div className="quiz-score_score">
                <span className="score">Your Score</span>
                <span className="score-number">
                  <span style={{ color: `${color}` }}>
                    {correctOne?.length}
                  </span>{" "}
                  / {array.length}
                </span>
                <span
                  style={{
                    border: `1px solid ${color}`,
                    color: color,
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: ".8rem",
                    backgroundColor: bcColor,
                  }}
                  className="satisfaction"
                >
                  {satisfaction}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="score-details  second">
          <div className="score-details-box">
            <div
              className="icon-background"
              style={{ backgroundColor: "#9857ff16" }}
            >
              <FaCheck size={14} color="#9857ff" />
            </div>
            <div className="content">
              <span className="content-word">Correct</span>
              <div className="correct-number">{correctOne?.length}</div>
              <div className="correct-percent">{percent?.toFixed(0)}%</div>
            </div>
          </div>
          <div className="score-details-box">
            <div
              className="icon-background"
              style={{ backgroundColor: " rgba(238, 27, 62, 0.417)" }}
            >
              <FaTimes color="rgb(246, 71, 100)" />
            </div>
            <div className="content">
              <span className="content-word">Incorrect</span>
              <span className="correct-number">{Incorrect.length}</span>
              <span className="correct-percent">
                {incorrectPercent.toFixed(0)}%
              </span>
            </div>
          </div>
          <div className="score-details-box">
            <div
              className="icon-background"
              style={{ backgroundColor: "rgba(255, 217, 0, 0.369)" }}
            >
              <FaClock color="gold" />
            </div>
            <div className="content">
              <span className="content-word too">Time spent</span>
              <div className="correct-number">{`${min}:${sec}`}</div>
              <div className="correct-percent">{`${totalMin}:${totalSec}`}</div>
            </div>
          </div>
          <div className="score-details-box">
            <div
              className="icon-background"
              style={{ backgroundColor: "rgba(0, 0, 255, 0.186)" }}
            >
              <FaBullseye color="blue" />
            </div>
            <div className="content">
              <span className="content-word blue">Accuracy</span>
              <div className="correct-number">{percent?.toFixed(0)}%</div>
              <div className="correct-percent small mtp">Your Accuracy</div>
            </div>
          </div>
        </div>
        <div className="quiz-overview">
          <h2 className="blue quiz-head">Quiz Review</h2>
          <div className="quiz-overview-container">
            {array?.map((question) => {
              return (
                <div className="quiz-overview-box" key={question?.questionNo}>
                  <div className="quiz-overview-details">
                    <div className="question-over-view">
                      <div className="div">
                        <p className="question-number-2">
                          {question?.questionNo + 1}
                        </p>
                        <div
                          className="icon-background"
                          style={{
                            backgroundColor: `${question?.answerSelected === question?.correctAnswer ? "rgba(11, 199, 96, 0.12)" : "rgba(238, 27, 62, 0.417)"}`,
                            border: `1px solid ${question?.answerSelected === question?.correctAnswer ? "rgb(11, 199, 96)" : "rgb(246, 71, 100)"}`,
                          }}
                        >
                          {question?.answerSelected ===
                          question?.correctAnswer ? (
                            <FaCheck
                              color={`${question?.answerSelected === question?.correctAnswer ? "rgb(11, 199, 96)" : "red"}`}
                            />
                          ) : (
                            <FaTimes
                              color={`${question?.answerSelected === question?.correctAnswer ? "rgb(11, 199, 96)" : "rgb(246, 71, 100)"}`}
                            />
                          )}
                        </div>
                      </div>
                      <p className="question-overview">{question?.question}</p>
                    </div>
                    <p
                      className="p-2"
                      style={{
                        color: `${question?.answerSelected === question?.correctAnswer ? "rgb(11, 199, 96)" : "rgb(246, 71, 100)"}`,
                        border: `1px solid ${question?.answerSelected === question?.correctAnswer ? "rgb(11, 199, 96)" : "rgb(246, 71, 100)"}`,
                        borderRadius: "5px",
                        backgroundColor: `${question?.answerSelected === question?.correctAnswer ? "rgba(11, 199, 96, 0.12)" : "rgba(255, 0, 0, 0.099)"}`,
                      }}
                    >
                      {question?.answerSelected === question?.correctAnswer
                        ? "correct"
                        : "Wrong"}
                    </p>
                  </div>
                  <div className="answer-box">
                    <p className="user-answer-review">
                      <span>Answer Selected</span>:{" "}
                      {question?.answerSelected ||
                        "You did not select any answer"}
                    </p>
                    <p className="correct-answer-review">
                      <span>Correct Answer</span>: {question?.correctAnswer}
                    </p>
                  </div>
                  <p className="explanation-paragraph">Explanation</p>
                  <div className="explanation">{question?.explanation}</div>
                </div>
              );
            })}
          </div>
        </div>
        <button
          className="exit-overview-button"
          style={{ cursor: "pointer" }}
          onClick={() => {
            setShowScore(false);
            navigate("/userpage");
            setArray([]);
            setTimeDone(null);
            setQuizData(null);
          }}
        >
          <LuLogOut />
          Exit
        </button>
      </div>
    </section>
  );
}
