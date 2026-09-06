import React from "react";
import "./upload.css";
import { FiUpload } from "react-icons/fi";
import { useState } from "react";
import { LuSettings } from "react-icons/lu";
import { useRef } from "react";
import { LuSparkles } from "react-icons/lu";
import { useContext, useEffect } from "react";
import { GlobalState } from "../../App";
import Spinner from "../spinner/spinner";

import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";

export default function Upload() {
  const {
    quizData,
    setQuizData,
    signinToken,
    setSigninToken,
    auth,
    setAuth,
    loading,
    setLoading,
    flashCardData,
    setFlashCardData,
    setShowFlashcard,
    showFlashcard,
    setShowQuiz,
    err,
    setErr,
  } = useContext(GlobalState);
  const id = nanoid();

  const [file, setFile] = useState(null);
  const [showConfig, setShowConfig] = useState(false);
  const [difficulty, setdifficulty] = useState(null);
  const [time, setTime] = useState(null);
  const [number, setNumber] = useState(null);
  const navigate = useNavigate();

  const configHandler = () => {
    setShowConfig(true);
  };
  const handleimage = (e) => {
    const file = e.target.files[0];
    console.log(file);
    setFile(file);
  };

  const removeFile = () => {
    setFile(null);
  };

  //  https://prisus-backend.onrender.com
  // https://prisus-backend.onrender.com

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

  const getFlashcards = async () => {
    setLoading(true);
    try {
      const formdata = new FormData();
      formdata.append("document", file);
      let res = await fetch(
        "https://prisus-backend.onrender.com/api/flashcards",
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${signinToken}`,
          },
          body: formdata,
        },
      );

      if (res.status === 401) {
        const refreshRes = await fetch(
          " https://prisus-backend.onrender.com/api/auth/refresh",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!res?.ok) {
          throw Error(`Something went wrong, Status code ${res?.status}`);
        }
        console.log(refreshRes);
        const refreshData = await refreshRes.json();
        setSigninToken(refreshData.token);
        // Retry original request with new token
        res = await fetch(
          "https://prisus-backend.onrender.com/api/flashcards",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${refreshData.token}`,
            },
            body: formdata,
          },
        );
      }
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        throw new Error(`${data.message}, Status Code: ${res.status}`);
      }
      setFlashCardData(data.flashcards);
      setFile(null);
      setShowFlashcard(true);
      navigate(`/flashcard/${id}`);
    } catch (error) {
      console.log(error);
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  };
  const getQuiz = async () => {
    if (!time || !difficulty || !number) {
      setErr("All fields must be completed");
    }

    setLoading(true);
    try {
      const formdata = new FormData();
      const timeLimit = +time;
      const totalQuestions = +number;
      console.log(totalQuestions, timeLimit);
      formdata.append("document", file);
      formdata.append("duration", timeLimit);
      formdata.append("mode", difficulty);
      formdata.append("numbers", totalQuestions);
      // https://prisus-backend.onrender.com

      for (const [key, value] of formdata.entries()) {
        console.log(key, value);
      }
      console.log(signinToken);
      let res = await fetch("https://prisus-backend.onrender.com/api/quiz", {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${signinToken}`,
        },
        body: formdata,
      });

      if (res.status === 401) {
        const refreshRes = await fetch(
          " https://prisus-backend.onrender.com/api/auth/refresh",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!refreshRes?.ok) {
          throw Error(
            `Something went wrong, Status code ${refreshRes?.status}`,
          );
        }
        console.log(refreshRes);
        const refreshData = await refreshRes.json();
        setSigninToken(refreshData.token);
        // Retry original request with new token
        res = await fetch("https://prisus-backend.onrender.com/api/quiz", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${refreshData.token}`,
          },
          body: formdata,
        });
      }

      const resdata = await res.json();

      if (!res.ok) {
        throw new Error(`${resdata.message}, Status Code: ${res.status}`);
      }
      console.log(resdata);
      if (resdata) {
        setQuizData(resdata);
        setShowQuiz(true);
        setFile(null);
        setdifficulty(null);
        setTime(null);
        setShowConfig(false);
        navigate(`/quiz/${id}`);
      }
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (difficulty) {
    console.log(difficulty);
  }

  if (quizData) {
    console.log(quizData);
  }

  if (time) {
    console.log(time);
  }
  return (
    <section className="upload">
      {!file && (
        <>
          <p className="upload-paragraph-head">
            Upload your study document to get the best of it!!
          </p>

          <div className="uplaod-container">
            <div className="upload-container-div">
              <h2 className="head">Upload A Document</h2>

              <form action="" className="form">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.pptx,.txt"
                  name="document"
                  id="document"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    handleimage(e);
                  }}
                />
                <label className="label" htmlFor="document">
                  <div className="upload-input">
                    <div className="input-container">
                      <FiUpload
                        size={44}
                        color="rgb(190, 188, 188)"
                        className="icon"
                      />
                      <p className="upload-paragraph">
                        Upload a file or drag and drop <br />
                        PDF,DOC,DOCX or TXT up to 2MB
                      </p>
                    </div>
                  </div>
                </label>
                <div className="btn-container">
                  <label
                    htmlFor="document"
                    // type="submit"
                    className="btn-choose-file"
                  >
                    Choose File
                  </label>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
      {file && (
        <div className="AI-generate-container">
          <div className="file">
            <div className="file-content">
              <p className="filename">
                <b>Selected:</b> {file?.name} ({(file?.size / 1024).toFixed()}KB
                )
              </p>
              <p
                className="remove"
                style={{ cursor: "pointer" }}
                onClick={removeFile}
              >
                Remove
              </p>
            </div>
          </div>
          <div className="spin-box">{loading && <Spinner />}</div>
          <div className="generate">
            <h2 className="about-head head">Select What to Generate</h2>
            <p className="paragraph p">Choose how you want to study 👇</p>
            <div className="button-container">
              <button className="flashcard-button" onClick={getFlashcards}>
                🧠Flashcard First
              </button>
              <button className="quiz-button" onClick={configHandler}>
                📝Quiz Only
              </button>
            </div>
          </div>
          {showConfig && (
            <div className="quiz-configuration">
              <p className="configuration-head">
                <LuSettings color="#7C5CFC" className="settings" />
                Quiz Configuration.
              </p>
              <p className="configuration-difficult">Difficulty.</p>

              <div className="difficulty-menu">
                <label
                  className={
                    difficulty === "Easy"
                      ? "normal selected"
                      : "normal not-selected"
                  }
                >
                  <input
                    className="radio"
                    type="radio"
                    name="difficulty"
                    id="difficulty"
                    value={"Easy"}
                    onChange={(e) => setdifficulty(e.currentTarget.value)}
                  />
                  <p className="mode">Easy</p>
                </label>
                <label
                  className={
                    difficulty === "medium"
                      ? "normal selected"
                      : "normal not-selected"
                  }
                >
                  <input
                    className="radio medium"
                    type="radio"
                    name="difficulty"
                    id="difficulty"
                    value="medium"
                    onChange={(e) => setdifficulty(e.currentTarget.value)}
                  />
                  <p className="mode small-fsz">Medium</p>
                </label>
                <label
                  className={
                    difficulty === "hard"
                      ? "normal selected"
                      : "normal not-selected"
                  }
                >
                  <input
                    className="radio"
                    type="radio"
                    name="difficulty"
                    id="difficulty"
                    value="hard"
                    onChange={(e) => setdifficulty(e.currentTarget.value)}
                  />
                  <p className="mode">Hard</p>
                </label>
                <label
                  className={
                    difficulty === "extremely hard"
                      ? "normal selected"
                      : "normal not-selected"
                  }
                >
                  <input
                    className="radio"
                    type="radio"
                    name="difficulty"
                    id="difficulty"
                    value="extremely hard"
                    onChange={(e) => setdifficulty(e.currentTarget.value)}
                  />
                  <span className="mode small-fsz">Expert</span>
                </label>
              </div>
              <p className="configuration-difficult">Time Limit(min).</p>

              <div className="difficulty-menu">
                <label
                  className={
                    time === "10" ? "normal selected" : "normal not-selected"
                  }
                >
                  <input
                    className="radio"
                    type="radio"
                    name="time"
                    id="time"
                    value={10}
                    onChange={(e) => setTime(e.currentTarget.value)}
                  />
                  <p className="mode">10</p>
                </label>
                <label
                  className={
                    time === "20" ? "normal selected" : "normal not-selected"
                  }
                >
                  <input
                    className="radio"
                    type="radio"
                    name="time"
                    id="time"
                    value={20}
                    onChange={(e) => setTime(e.currentTarget.value)}
                  />
                  <p className="mode">20</p>
                </label>
                <label
                  className={
                    time === "30" ? "normal selected" : "normal not-selected"
                  }
                >
                  <input
                    className="radio"
                    type="radio"
                    name="time"
                    id="time"
                    value={30}
                    onChange={(e) => setTime(e.currentTarget.value)}
                  />
                  <p className="mode">30</p>
                </label>
                <label
                  className={
                    time === "40" ? "normal selected" : "normal not-selected"
                  }
                >
                  <input
                    className="radio"
                    type="radio"
                    name="time"
                    id="time"
                    value={40}
                    onChange={(e) => setTime(e.currentTarget.value)}
                  />
                  <p className="mode">40</p>
                </label>
              </div>
              <p className="configuration-difficult">No of Questions.</p>

              <div className="difficulty-menu">
                <label
                  className={
                    number === "10" ? "normal selected" : "normal not-selected"
                  }
                >
                  <input
                    className="radio"
                    type="radio"
                    name="number"
                    id="number"
                    value={10}
                    onChange={(e) => setNumber(e.currentTarget.value)}
                  />
                  <p className="mode">10</p>
                </label>
                <label
                  className={
                    number === "20" ? "normal selected" : "normal not-selected"
                  }
                >
                  <input
                    className="radio"
                    type="radio"
                    name="number"
                    id="number"
                    value={20}
                    onChange={(e) => setNumber(e.currentTarget.value)}
                  />
                  <p className="mode">20</p>
                </label>
                <label
                  className={
                    number === "30" ? "normal selected" : "normal not-selected"
                  }
                >
                  <input
                    className="radio"
                    type="radio"
                    name="number"
                    id="number"
                    value={30}
                    onChange={(e) => setNumber(e.currentTarget.value)}
                  />
                  <p className="mode">30</p>
                </label>
                <label
                  className={
                    number === "40" ? "normal selected" : "normal not-selected"
                  }
                >
                  <input
                    className="radio"
                    type="radio"
                    name="number"
                    id="number"
                    value={40}
                    onChange={(e) => setNumber(e.currentTarget.value)}
                  />
                  <p className="mode">40</p>
                </label>
              </div>

              <div className="btn-container">
                <button className="btn m" onClick={getQuiz}>
                  <LuSparkles className="sparkles" />
                  Generate Quiz
                </button>
              </div>
            </div>
          )}{" "}
        </div>
      )}{" "}
    </section>
  );
}
