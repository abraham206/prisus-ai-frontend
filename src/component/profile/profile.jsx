import React, { useContext, useState } from "react";
import "./profile.css";
import { LuCircleUserRound, LuLogOut } from "react-icons/lu";
import { LuMail } from "react-icons/lu";
import { LuCalendar } from "react-icons/lu";
import { LuShieldCheck } from "react-icons/lu";
import { LuLock } from "react-icons/lu";
import { FaPencil } from "react-icons/fa6";
import ProgressCircle from "../progress-circle";
import { LuChevronRight } from "react-icons/lu";
import { FaFilePdf } from "react-icons/fa6";
import { FaFileWord } from "react-icons/fa6";
import { FaFileAlt } from "react-icons/fa";
import { FaList } from "react-icons/fa6";
import { useEffect } from "react";
import { GlobalState } from "../../App";
import Spinner from "../spinner/spinner";
import { useNavigate } from "react-router-dom";

// #2563EB
// #EF4444
// #6B7280

// #764649
// https://prisus-backend.onrender.com

const arr = [1, 2];
console.log(arr.length);

export default function Userprofile() {
  const {
    signinToken,
    userData,
    setUserData,
    setSigninToken,
    setLoading,
    loading,
    auth,
    setAuth,
    setUserName,
    setCheckScore,
    setShowEditUser,
    setEditPassword,
    setName,
    setEmail,
    err,
    setErr,
    userQuiz,
    setUserQuiz,
    setShowScore,
  } = useContext(GlobalState);
  const color = userData?.verified ? "rgb(116, 198, 72)" : "#f63737";
  const borderColor = userData?.verified ? "rgb(43, 75, 26)" : "#f63737";
  const navigate = useNavigate();

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const response = await fetch(
          "https://prisus-backend.onrender.com/api/auth/refresh",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        console.log(response);
        if (!response.ok) {
          setSigninToken(null);
        }

        const data = await response.json();
        console.log(data);
        setSigninToken(data.token);
      } catch (error) {
        setSigninToken(null);
        setErr(error.message);
      }
    };

    refreshToken();
  }, []);

  const logout = async () => {
    setLoading(true);
    try {
      let res = await fetch(
        "https://prisus-backend.onrender.com/api/auth/logout",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${signinToken}`,
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

        console.log(refreshRes);
        const refreshData = await refreshRes.json();
        if (!res?.ok) {
          throw new Error(`Something went wrong, Status code ${res?.status}`);
        }
        setSigninToken(refreshData.token);
        // Retry original request with new token
        res = await fetch(
          "https://prisus-backend.onrender.com/api/auth/logout",
          {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${refreshData?.token}`,
              "Content-Type": "application/json",
            },
          },
        );
      }

      const data = await res.json();
      if (!res.ok) {
        setSigninToken(null);
      }

      console.log(data);
      localStorage.removeItem("auth");
      setAuth(false);
      navigate("/");
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    async function getUser() {
      setLoading(true);
      try {
        let res = await fetch(
          `https://prisus-backend.onrender.com/api/getUser`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${signinToken}`,
              "Content-Type": "application/json",
            },
          },
        );
        console.log(res);
        // If access token expired
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

          console.log(refreshRes);
          const refreshData = await refreshRes.json();
          if (!refreshRes?.ok) {
            throw new Error(
              `Something went wrong, Status code ${refreshRes?.status}`,
            );
          }
          setSigninToken(refreshData.token);
          // Retry original request with new token
          res = await fetch("https://prisus-backend.onrender.com/api/getUser", {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${refreshData?.token}`,
              "Content-Type": "application/json",
            },
          });
        }

        const user = await res.json();
        console.log(user);
        setUserData(user.user);
        setUserQuiz(user.user.quizCreated);
        setUserName(user.user.name);
        setEmail(user.user.email);
        setName(user.user.name);
      } catch (error) {
        console.log(error.message);
        setErr(`${error.message}, try again later!`);
      } finally {
        setLoading(false);
      }
    }
    getUser();
  }, []);

  return (
    <section className="user-section">
      <div className="word">
        <div className="word-div">
          <span className="user-head">My Profile</span>
          <span className="user-paragraph">
            View and manage your account management and quiz history
          </span>
        </div>
        {loading && <Spinner />}
      </div>
      <div className="user-section-container">
        <div className="user-profile">
          <div className="information">
            <p className="information-paragraph">Personal information</p>
            <span
              className="edit-2"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setShowEditUser(true);
              }}
            >
              Edit
              <FaPencil
                color="#9857ff"
                size={15}
                style={{ marginLeft: "1rem" }}
              />
            </span>
          </div>
          <div className="profile-pic-container">
            <div className="profilepic">
              {userData?.name.slice(0, 1).toUpperCase() || "A"}
            </div>
            <div className="profile-mini-detail">
              <span className="white">{userData?.name}</span>
              <span style={{ color: "rgb(187, 186, 186)", fontSize: ".7rem" }}>
                {userData?.email}
              </span>
            </div>
          </div>

          <div className="profile-details">
            <div className="profile-details__info">
              <p className="credential">
                <LuCircleUserRound className="user-icon" /> Full name
              </p>
              <p className="credential-info fname">{userData?.name}</p>
            </div>
            <div className="profile-details__info">
              <p className="credential">
                <LuMail className="user-icon" /> Email
              </p>
              <p className="credential-info">{userData?.email}</p>
            </div>
            <div className="profile-details__info">
              <p className="credential">
                <LuCalendar className="user-icon" /> Joined
              </p>
              <p className="credential-info">{userData?.createdAt}</p>
            </div>
            <div className="profile-details__info">
              <p className="credential">
                <LuShieldCheck className="user-icon" /> Account
              </p>
              <p
                className="credential-info verified"
                style={{
                  color: `${color}`,
                  border: `0.2px solid ${borderColor}`,
                }}
              >
                {userData?.verified ? "verified" : "not-verified"}
              </p>
            </div>

            <div className="profile-details__info">
              <p className="credential">
                <LuLock className="user-icon" /> Password
              </p>
              <div className="password-div">
                <p className="credential-info password">..........</p>
                <p
                  style={{ color: "#9857ff", cursor: "pointer" }}
                  onClick={() => {
                    setEditPassword(true);
                  }}
                >
                  change
                </p>
              </div>
            </div>
            <div className="edit-button-container">
              <button
                className="edit-profile-btn"
                onClick={logout}
                style={{ cursor: "pointer" }}
              >
                <LuLogOut color="#9857ff" style={{ marginRight: "1rem" }} />
                Log Out
              </button>
            </div>
          </div>
        </div>
        <div className="user-quiz">
          <p>Quiz History</p>
          <div className="user-quiz-container">
            {userData?.quizCreated?.slice(0, 5).map((quiz) => {
              return (
                <div
                  onClick={() => {
                    setCheckScore(true);
                    setShowScore(true);
                    navigate(`/userscore/${quiz.id}`);
                  }}
                  className="user-quiz-div"
                >
                  <div
                    className="file-container"
                    style={{
                      backgroundColor: `${quiz.fileType === ".pdf" ? "#EF4444" : "#2563EB"}`,
                    }}
                  >
                    {quiz.fileType === ".pdf" ? (
                      <FaFilePdf
                        className="file-icon"
                        // size={50} color="white"
                      />
                    ) : (
                      <FaFileWord className="file-icon" />
                    )}
                  </div>
                  <div className="user-quiz-detail">
                    <span className="topic">{quiz.subject}</span>
                    <span className="question-type">
                      {quiz.questions.length} questions . Multiple choice
                    </span>
                    <div className="quiz-difficulty">{quiz.difficulty}</div>
                  </div>
                  <div className="user-quiz-container-2">
                    <div className="user-quiz-score">
                      {quiz.percent && <ProgressCircle percentage={33} />}
                    </div>

                    <div className="user-quiz-time">
                      <span className="date">{quiz.date}</span>
                      <span className="time">{quiz.time}</span>
                    </div>
                    <div className="arrow-icon">
                      <LuChevronRight />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="button-container-3">
            {userData?.quizCreated.length > 5 && (
              <button
                className="view-all"
                onClick={() => {
                  navigate("/sessions");
                }}
              >
                <FaList style={{ marginRight: "1rem" }} />
                View All Sessions
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
