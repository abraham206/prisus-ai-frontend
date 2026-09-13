// import "./sessioncss";
import React from "react";
import "./session.css";
import { useEffect, useContext, useState } from "react";
import Spinner from "../spinner/spinner";
import { useNavigate } from "react-router-dom";
import ProgressCircle from "../progress-circle";
import {
  FaFileWord,
  FaFilePdf,
  FaLightbulb,
  FaFile,
  FaClock,
} from "react-icons/fa6";
// import { LuClipboardCheck } from "react-icons/fa6";
import {
  LuClipboardCheck,
  LuTrendingUp,
  LuArrowRight,
  LuArrowLeft,
} from "react-icons/lu";
import { FaCalendar } from "react-icons/fa";
import { GlobalState } from "../../App";

export default function Session() {
  const {
    signinToken,
    name,
    setSigninToken,
    setErr,
    err,
    loading,
    setLoading,
    totalTimePerUser,
    setShowScore,
    setTotalTimePerUser,
    setFlashCardData,
    setShowFlashcard,
    setCheckScore,
  } = useContext(GlobalState);
  const [session, setSession] = useState("");
  const [allSession, setAllSession] = useState("");
  const [quiz, setQuiz] = useState("");
  const [flashcard, setFlashcard] = useState("");
  const [type, settype] = useState("All");
  const [nonFlashcard, setNonFlashcard] = useState("");
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const start = (page - 1) * 5;
  const end = page * 5;
  const resultPerPage = 5;
  const numRes = session?.length;
  const numPag = Math.ceil(numRes / resultPerPage);

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

        if (!response.ok) {
          throw new Error(
            `Could Not get token Status Code: ${response.status}`,
          );
        }

        const data = await response.json();
        console.log(data);
        setSigninToken(data.token);
      } catch (error) {}
    };

    refreshToken();
  }, []);

  const buttonFunc = () => {
    if (page === 1 && numPag > 1) {
      console.log("first page and others");
      return (
        <>
          <div className="arrow-container" style={{ opacity: 0 }}>
            <LuArrowLeft />
          </div>

          <div className="arrow-container">
            <LuArrowRight
              style={{ cursor: "pointer" }}
              onClick={() => {
                setPage((prevPage) => prevPage + 1);
              }}
            />
          </div>
        </>
      );
    }

    if (page === 1 && numPag <= 1) {
      return null;
    }

    if (page === numPag && numPag > 1) {
      console.log("last page");
      return (
        <>
          <div className="arrow-container">
            <LuArrowLeft
              style={{ cursor: "pointer" }}
              onClick={() => {
                setPage((prevPage) => prevPage - 1);
              }}
            />
          </div>

          <div className="arrow-container" style={{ opacity: 0 }}>
            <LuArrowLeft />
          </div>
        </>
      );
    }

    if (page < numPag) {
      return (
        <>
          <div className="arrow-container">
            <LuArrowLeft
              style={{ cursor: "pointer" }}
              onClick={() => {
                setPage((prevPage) => prevPage - 1);
              }}
            />
          </div>

          <div className="arrow-container">
            <LuArrowRight
              style={{ cursor: "pointer" }}
              onClick={() => {
                setPage((prevPage) => prevPage + 1);
              }}
            />
          </div>
        </>
      );
    }
  };
  useEffect(() => {
    console.log(numPag);
  }, [session]);

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

        if (!response.ok) {
          setSigninToken(null);
          throw new Error(
            `Could Not get token Status Code: ${response.status}`,
          );
        }

        const data = await response.json();
        setSigninToken(data.token);
      } catch (error) {
        setSigninToken(null);
      }
    };

    refreshToken();
  }, []);

  const fetchFlashcard = async (id, sessionType) => {
    if (sessionType === "quiz") {
      setCheckScore(true);
      setShowScore(true);
      navigate(`/userscore/${id}`);
    }

    if (sessionType === "flashcards") {
      try {
        let res = await fetch(
          `https://prisus-backend.onrender.com/api/get-flashcard/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${signinToken}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (res?.status === 401) {
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

          const refreshData = await refreshRes.json();
          if (!refreshRes?.ok) {
            throw new Error(
              `Something went wrong, Status code ${refreshRes?.status}`,
            );
          }
          setSigninToken(refreshData.token);
          // Retry original request with new token
          res = await fetch(
            `https://prisus-backend.onrender.com/api/get-flashcard/${id}`,
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
          throw new Error(`${data.message}, Status code:${res.status}`);
        }
        setFlashCardData(data.flashcards);
        setShowFlashcard(true);
        navigate(`/flashcard/${data.flashcards._id}`);
      } catch (error) {
        setErr(error.message);
      }
    }
  };
  useEffect(() => {
    const allSection = document.querySelectorAll(".select");

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("animation");
          }
        });
      },
      {
        threshold: 0.2,
      },
    );

    allSection.forEach((section) => sectionObserver.observe(section));
    return () => sectionObserver.disconnect();
  }, []);

  const getDashboard = async () => {
    setLoading(true);
    try {
      let res = await fetch(
        "https://prisus-backend.onrender.com/api/user-session",
        {
          method: "GET",
          headers: {
            Content_type: "application/json",
            Authorization: `Bearer ${signinToken}`,
          },
        },
      );

      if (res?.status === 401) {
        const refreshRes = await fetch(
          "http://localhost/8080:/api/auth/refresh",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const refreshData = await refreshRes.json();
        if (!res?.ok) {
          setSigninToken(null);
        }
        setSigninToken(refreshData.token);
        // Retry original request with new token
        res = await fetch(
          "https://prisus-backend.onrender.com/api/user-session",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${refreshData?.token}`,
            },
          },
        );
      }
      const data = await res.json();
      if (!res.ok) {
        setErr(`${data.message} status code:${res.status}`);
      }
      setSession(data.sessions);
      setAllSession(data.sessions);
      setNonFlashcard(data.totalFlashcards);
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getDashboard();
  }, []);

  useEffect(() => {
    if (typeof session === "string") return;
    setQuiz(session?.filter((item) => item.type === "quiz"));
    setFlashcard(session?.filter((item) => item.type === "flashcards"));
  }, [session]);

  useEffect(() => {
    if (typeof session === "string") return;
    if (type === "quiz" && quiz) {
      setAllSession(quiz);
    }

    if (type === "flashcards" && flashcard) {
      setAllSession(flashcard);
    }

    if (type === "All") {
      setAllSession(session);
    }
  }, [session, type]);

  return (
    <main className="dashboard session-box">
      {loading ? (
        <div className="spinner-container-div">
          <Spinner />
        </div>
      ) : (
        <div className="dashboard-container">
          <div className="dashboard-welcome-messg">
            <div className="first-box">
              <span className="span-1">Sessions</span>
              <span className="welcome">
                All your quiz attempts and flashcards sessions in one place
              </span>
            </div>
            <div className="second-box">
              <div
                className="profile-2"
                onClick={() => {
                  // navigate("/userpage");
                }}
              >
                {name.split(" ")[0].slice(0, 1).toUpperCase()}
              </div>
              <p className="user-name">{name}</p>
            </div>
          </div>
          <div className="user-stats">
            <div className="user-stats-data">
              <div className="dashboard-data-content">
                <div
                  className="dashboard-icon-box"
                  style={{
                    backgroundColor: "#8c6cff3b",
                    border: "1px solid #8c6cff65",
                  }}
                >
                  <FaFile color="#8b6cff" />
                </div>
                <div className="dashboard-data">
                  <span className="same">Total Sessions</span>
                  <span className="same val">{session?.length}</span>
                  <span className="same">Across all docs</span>
                </div>
              </div>
            </div>
            <div className="user-stats-data">
              <div className="dashboard-data-content">
                <div
                  className="dashboard-icon-box"
                  style={{
                    border: "1px solid rgba(11, 199, 96, 0.52)",
                    backgroundColor: "rgba(11, 199, 96, 0.19)",
                  }}
                >
                  <LuClipboardCheck color="rgb(11, 199, 96)" />
                </div>
                <div className="dashboard-data">
                  <span className="same">Quizzes Taken</span>
                  <span className="same val">{quiz?.length}</span>
                  <span className="same">Across all docs</span>
                </div>
              </div>
            </div>
            <div className="user-stats-data">
              <div className="dashboard-data-content">
                <div
                  className="dashboard-icon-box"
                  style={{
                    border: "1px solid rgba(255, 196, 0, 0.33)",
                    backgroundColor: "rgba(255, 196, 0, 0.22)",
                  }}
                >
                  <FaClock color="rgb(255, 196, 0)" />
                </div>
                <div className="dashboard-data">
                  <span className="same">Total time</span>
                  <span className="same val">
                    {totalTimePerUser || "0hr:00min"}
                  </span>
                  <span className="same">Spent</span>
                </div>
              </div>
            </div>
            <div className="user-stats-data">
              <div className="dashboard-data-content">
                <div
                  className="dashboard-icon-box"
                  style={{
                    backgroundColor: "rgba(14, 115, 188, 0.26)",
                    border: "1px solid rgb(14, 116, 188)",
                  }}
                  color="rgba(14, 115, 188, 0.51)"
                >
                  <LuTrendingUp color="rgb(14, 116, 188)" />
                </div>
                <div className="dashboard-data">
                  <span className="same">Flashcards</span>
                  <span className="same val">{nonFlashcard}</span>
                  <span className="same">Across all docs</span>
                </div>
              </div>
            </div>
          </div>

          <div className="all-sessions">
            <div className="filters">
              <div className="filter-check">
                <label
                  className={
                    type === "All" ? "normal-2 selected-2" : "normal-2"
                  }
                >
                  <input
                    className="radio"
                    type="radio"
                    name="type"
                    id="type"
                    style={{ display: "none" }}
                    value={"All"}
                    onChange={(e) => settype(e.currentTarget.value)}
                  />
                  <p
                    style={{
                      color: `${type === "All" ? "#9857ff" : "rgb(168, 167, 167)"}`,
                    }}
                  >
                    All Sessions
                  </p>
                </label>
                <label
                  className={
                    type === "quiz" ? "normal-2 selected-2" : "normal-2"
                  }
                >
                  <input
                    className="radio medium"
                    type="radio"
                    name="type"
                    id="type"
                    style={{ display: "none" }}
                    value="quiz"
                    onChange={(e) => settype(e.currentTarget.value)}
                  />
                  <p
                    style={{
                      color: `${type === "quiz" ? "#9857ff" : "rgb(168, 167, 167)"}`,
                    }}
                  >
                    Quizes
                  </p>
                </label>
                <label
                  className={
                    type === "flashcards" ? "normal-2 selected-2" : "normal-2"
                  }
                >
                  <input
                    className="radio"
                    type="radio"
                    name="type"
                    id="type"
                    value="flashcards"
                    style={{ display: "none" }}
                    onChange={(e) => settype(e.currentTarget.value)}
                  />
                  <p
                    style={{
                      color: `${type === "flashcards" ? "#9857ff" : "rgb(168, 167, 167)"}`,
                    }}
                  >
                    Flashcards
                  </p>
                </label>
              </div>
            </div>

            <div className="session-contents">
              {allSession && allSession.length > 0 ? (
                allSession.slice(start, end)?.map((el) => {
                  let color;
                  if (el.score > 75 && el.score) {
                    color = "rgb(11, 199, 96)";
                  }

                  if (el.score >= 50 && el.score < 75) {
                    color = "rgb(255, 196, 0)";
                  }

                  if (el.score < 50) {
                    color = "rgb(248, 35, 70)";
                  }

                  return (
                    <div className="session-content-item">
                      <div className="session-about">
                        <div
                          className="session-type-container"
                          style={{
                            backgroundColor: "rgba(120, 51, 204, 0.22)",
                            border: "1px solid #9857ff4c",
                            color: "#9857ff",
                          }}
                        >
                          <LuClipboardCheck />
                        </div>
                        <div className="session-type-name">
                          <span className="type-name">
                            {el.subject} - {el.type}
                          </span>
                          <div className="session-detail">
                            <span className="session-number">
                              {el?.number || "20"}{" "}
                              {el.type === "quiz" ? "Questions" : "cards"}
                            </span>
                            <span className="session-type-session">
                              {el?.type}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div
                        className="session-file-container"
                        style={{
                          backgroundColor: `${el.fileType === ".pdf" ? "#EF4444" : "#3B82F6"}`,
                        }}
                      >
                        {el.fileType === ".pdf" ? (
                          <FaFilePdf />
                        ) : (
                          <FaFileWord />
                        )}
                      </div>
                      <div className="session-type-score">
                        {el.score ? (
                          <p className="quiz-score">
                            <span style={{ color: "rgb(160, 159, 159)" }}>
                              Score
                            </span>{" "}
                            <span style={{ color: color }}>{el.score}%</span>
                          </p>
                        ) : (
                          <p className="quiz-score">
                            <span style={{ color: "rgb(160, 159, 159)" }}>
                              No
                            </span>{" "}
                            <span style={{ color: "rgb(160, 159, 159)" }}>
                              Score
                            </span>
                          </p>
                        )}
                      </div>

                      {type === "flashcards" && <div></div>}
                      <div className="session-type-date">
                        <span className="type-date">{el.date}</span>
                        <span className="type-time">{el.time}</span>
                      </div>

                      <div
                        className="session-button-review"
                        style={{ cursor: "pointer" }}
                        onClick={() => fetchFlashcard(el.typeId, el.type)}
                      >
                        View
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="nothing">Upload a document to start studying!</p>
              )}
            </div>
          </div>
          <div className="page-navigation-button">{buttonFunc()}</div>
          <h2 className="motto-word">
            Limit Only Exists In The Cerebral Cortex!!
          </h2>
        </div>
      )}
    </main>
  );
}
