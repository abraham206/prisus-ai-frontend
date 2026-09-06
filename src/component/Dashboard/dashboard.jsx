import "./dashboard.css";
import React from "react";
import Spinner from "../spinner/spinner";
import { useEffect, useContext, useState } from "react";
import ProgressCircle from "../progress-circle";
import { useNavigate } from "react-router-dom";
import {
  FaFileWord,
  FaFilePdf,
  FaLightbulb,
  FaFile,
  FaClock,
} from "react-icons/fa6";
import { FaQuestion } from "react-icons/fa6";
import { LuTrendingUp } from "react-icons/lu";
import { FaCalendar } from "react-icons/fa";
import { GlobalState } from "../../App";

export default function Dashboard() {
  const {
    signinToken,
    name,
    setSigninToken,
    setErr,
    err,
    loading,
    setLoading,
    totalTimePerUser,
    setTotalTimePerUser,
    setCheckScore,
    setShowScore,
  } = useContext(GlobalState);
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState("");
  const [UserTimeSpent, setUserTimeSpent] = useState("");
  const [timeSpent, setTimeSpent] = useState("");
  useEffect(() => {
    const allSection = document.querySelectorAll(".select");

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        console.log(entries);
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("animation");
          }
          // if (!entry.isIntersecting) {
          //   entry.target.classList.add("animation");
          // }
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
        "https://prisus-backend.onrender.com/api/user-dashboard",
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

        console.log(refreshRes);
        const refreshData = await refreshRes.json();
        if (!res?.ok) {
          setSigninToken(null);
        }
        setSigninToken(refreshData.token);
        // Retry original request with new token
        res = await fetch(
          "https://prisus-backend.onrender.com/api/user-dashboard",
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
      console.log(data);
      setDashboard(data.data);

      if (data.data?.userStats && data.data?.userStats[0]?.totalTime === null) {
        setUserTimeSpent(`0hr:0min`);
      }
      setUserTimeSpent(data.data?.userStats[0]?.totalTime);
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
    const hours = Math.floor(UserTimeSpent / 3600);
    const minutes = Math.floor((UserTimeSpent % 3600) / 60);
    setTimeSpent(`${hours}hr ${minutes}min`);
    setTotalTimePerUser(`${hours}hr ${minutes}min`);
  }, [UserTimeSpent]);

  return (
    <main className="dashboard">
      {loading ? (
        <div className="spinner-container-div">
          <Spinner />
        </div>
      ) : (
        <div className="dashboard-container">
          <div className="dashboard-welcome-messg">
            <div className="first-box">
              <span className="span-1">Dashboard</span>
              <span className="welcome">
                Welcome back, {name.split(" ")[1]}!👋
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
                  <FaFile color="#9857ff" />
                </div>
                <div className="dashboard-data">
                  <span className="same">Documents</span>
                  <span className="same val">{dashboard?.totalDocs}</span>
                  <span className="same">Total Uploaded</span>
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
                  <FaQuestion color="rgb(11, 199, 96)" />
                </div>
                <div className="dashboard-data">
                  <span className="same">Quizzes Taken</span>
                  <span className="same val">
                    {dashboard.userStats &&
                      dashboard?.userStats[0]?.totalQuizCreated}
                  </span>
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
                    {dashboard?.userStats?.length > 0 ? timeSpent : "0hr 0min"}
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
                  <span className="same">Average Score</span>
                  <span className="same val">
                    {dashboard.userStats &&
                      dashboard?.userStats[0]?.averageScore.toFixed(2)}
                    %
                  </span>
                  <span className="same">Top Performance</span>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-documents">
            <div className="dashboard-documents-content">
              <span className="span-1">Recent Documents</span>
              <div className="dashboard-documents-container">
                {dashboard.userDocs &&
                  dashboard?.userDocs.map((docs) => {
                    return (
                      <div className="dashboard-document-list">
                        <div className="about-documents">
                          <div
                            className="dashboard-file-container"
                            style={{
                              backgroundColor: `${docs.fileType === ".pdf" ? "#EF4444" : "#2563EB"}`,
                            }}
                          >
                            {docs.fileType === ".pdf" ? (
                              <FaFilePdf />
                            ) : (
                              <FaFileWord />
                            )}
                          </div>
                          <div className="document-about-features">
                            <span className="span-2 lower">{docs?.name}</span>
                            <span className="lower-span okay">
                              Uploaded 2h ago . {(docs?.size / 1024).toFixed(2)}
                              KB
                            </span>
                          </div>
                          <div className="features-document">{docs?.type}</div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="container-2">
              <span className="span-1">Recent Sessions</span>
              <div className="dashboard-recent-session">
                {dashboard.userStats &&
                  dashboard?.userStats[0]?.quiz.slice(0, 5).map((quiz) => {
                    return (
                      <div className="dashboard-session-content">
                        <div className="session-type">
                          <div
                            className="dashboard-icon-box small-size"
                            style={{
                              backgroundColor: "#8c6cff3b",
                              border: "1px solid #8c6cff65",
                            }}
                          >
                            <FaQuestion color="#9857ff" />
                          </div>
                          <div className="session-type-features">
                            <span className="span-2 lower media">
                              {quiz.subject}
                            </span>
                            <span className="lower-span low-2">
                              Quiz . {quiz.totalQuestion} questions
                            </span>
                          </div>
                        </div>
                        <div className="session-score">
                          <div className="session-score-percent">
                            <ProgressCircle
                              percentage={quiz?.score?.toFixed(0)}
                            />
                          </div>
                        </div>
                        <div className="session-date">
                          <div className="session-date-content">
                            <div className="date-content">
                              <span>{quiz?.date}</span>
                              <span>{quiz?.time}</span>
                            </div>
                          </div>
                        </div>
                        <div
                          className="session-view"
                          onClick={() => {
                            setCheckScore(true);
                            setShowScore(true);
                            navigate(`/userscore/${quiz.id}`);
                          }}
                        >
                          view
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          <h2 className="motto-word">
            Limit Only Exists In The Cerebral Cortex!!
          </h2>
        </div>
      )}{" "}
    </main>
  );
}
