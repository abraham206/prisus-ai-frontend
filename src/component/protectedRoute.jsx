import { GlobalState } from "../App";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { auth, showFlashcard, showQuiz, showScore } = useContext(GlobalState);
  if (!auth) {
    return <Navigate replace to="/signin" />;
  }

  return children;
}
