import { GlobalState } from "./App";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

export default function Authorize({ children }) {
  const { auth, showFlashcard, showQuiz, showScore } = useContext(GlobalState);
  if (!showScore) {
    return <Navigate replace to="/Upload" />;
  }
  return children;
}
