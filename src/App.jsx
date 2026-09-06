import React, { lazy, Suspense, useState } from "react";
import { createContext } from "react";
export const GlobalState = createContext(null);
import { Route, Routes } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import ProtectedRoute from "./component/protectedRoute";
import Signin from "./component/signin/signin";
import Upload from "./component/uploadpage/upload";
import Score from "./component/score/score";

import AboutPage from "./component/aboutfolder/aboutfolder";

import Flashcard from "./component/flashcard/flashcard";
import Userprofile from "./component/profile/profile";
import Quiz from "./component/Quiz/quiz";
import Signup from "./component/signup/signup";
import Home from "./component/home";
import Nav from "./component/nav/nav";
import Footer from "./component/footer/footer";
import Dashboard from "./component/Dashboard/dashboard";
import Session from "./component/session/session";
import Authorize from "./authorization";
import AuthorizeQuiz from "./authorize-quiz";
import AuthorizeCards from "./authorize-cards";
function App() {
  const [timeDone, setTimeDone] = useState("");
  const [totalTime, setTotalTime] = useState("");
  const [quizData, setQuizData] = useState("");
  const [time, setTime] = useState("");
  const [signinToken, setSigninToken] = useState("");
  const [array, setArray] = useState([]);
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useState(localStorage.getItem("auth") || false);
  const [checkScore, setCheckScore] = useState(false);
  const [flashCardData, setFlashCardData] = useState("");
  const [showEditUser, setShowEditUser] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);
  const [err, setErr] = useState("");
  const [userQuiz, setUserQuiz] = useState("");
  const [showFlashcard, setShowFlashcard] = useState(false);
  const [userName, setUserName] = useState("");
  const [totalTimePerUser, setTotalTimePerUser] = useState("");
  const [showScore, setShowScore] = useState(false);

  return (
    <main className="webpage">
      <>
        <GlobalState.Provider
          value={{
            quizData,
            showScore,
            setShowScore,
            setShowFlashcard,
            showFlashcard,
            setFlashCardData,
            totalTimePerUser,
            setTotalTimePerUser,
            userQuiz,
            setUserQuiz,
            setQuizData,
            time,
            setTime,
            signinToken,
            setSigninToken,
            timeDone,
            setTimeDone,
            totalTime,
            setTotalTime,
            array,
            setArray,
            userData,
            setUserData,
            loading,
            setLoading,
            auth,
            setAuth,
            userName,
            setUserName,
            checkScore,
            setCheckScore,
            flashCardData,
            setFlashCardData,
            showEditUser,
            setShowEditUser,
            editPassword,
            setEditPassword,
            name,
            setName,
            email,
            setEmail,
            showQuiz,
            setShowQuiz,
            err,
            setErr,
          }}
        >
          {/* <Suspense fallback={() => <h1>Loading......</h1>}> */}
          <Routes>
            <Route exact path="/" element={<Nav />}>
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />

              <Route path="/" element={<Home />} />
              <Route path="/About" element={<AboutPage />} />
              <Route
                path="/Upload"
                element={
                  <>
                    <Upload />
                  </>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <>
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  </>
                }
              />
              <Route
                path="/sessions"
                element={
                  <>
                    <ProtectedRoute>
                      <Session />
                    </ProtectedRoute>
                  </>
                }
              />
              <Route
                path="/quiz/:id"
                element={
                  <>
                    <AuthorizeQuiz>
                      <Quiz />
                    </AuthorizeQuiz>
                  </>
                }
              />
              <Route
                path="/userpage"
                element={
                  <>
                    <ProtectedRoute>
                      <Userprofile />
                    </ProtectedRoute>
                  </>
                }
              />
              <Route
                path="/userscore/:quizId"
                element={
                  <>
                    <Authorize>
                      <Score />
                    </Authorize>
                  </>
                }
              />
              <Route
                path="/flashcard/:id"
                element={
                  <>
                    <AuthorizeCards>
                      <Flashcard />
                    </AuthorizeCards>
                  </>
                }
              />
            </Route>
          </Routes>
          {/* </Suspense> */}
        </GlobalState.Provider>
      </>
    </main>
  );
}

export default App;
