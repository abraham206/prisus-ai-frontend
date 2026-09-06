import { FcDepartment } from "react-icons/fc";
import image from "./src/assets/sarah.jfif";
import image2 from "./src/assets/david.jfif";
import image3 from "./src/assets/amaka.jfif";

const students = [
  {
    image: image,
    reviews:
      "“Prisus.ai completely changed the way I study! Flashcards and quizzes are ready in seconds. No more late nights creating questions manually.”",
    reviewer: "Sarah Johnson",
    department: "Medical Student",
  },
  {
    image: image2,
    reviews:
      "“The quiz generation is 🔥. It actually summarizes complex notes accurately. Makes revision so much faster.”",
    reviewer: "David Kim",
    department: "Computer Science Undergraduate",
  },
  {
    image: image3,
    reviews:
      "“I love the clean UI and how easy it is to navigate. Prisus.ai is like having a smart study buddy with me.”",
    reviewer: "Amaka Obi",
    department: "Chemistry Student",
  },
];

export default students;
