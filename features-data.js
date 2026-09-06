import { FaFile } from "react-icons/fa";
import { LuBrainCircuit } from "react-icons/lu";
import { LuZap } from "react-icons/lu";
import { LuTrendingUp } from "react-icons/lu";

const data = [
  {
    feature: "Document Upload",
    about:
      "Upload your study materials in various formats and let our AI analyze them.",
    image: FaFile,
  },
  {
    feature: "AI-Generated Tests",
    about: "Get personalized tests generated based on your study materials.",
    image: LuBrainCircuit,
  },
  {
    feature: "Instant Feedback",
    about:
      "Receive immediate feedback on your answers and track your progress.",
    image: LuZap,
  },
  {
    feature: "Progress Tracking",
    about: "Monitor your learning progress and identify areas for improvement.",
    image: LuTrendingUp,
  },
];

export default data;
