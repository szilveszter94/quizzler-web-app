import rank1 from "../assets/ranks/rank1.png";
import rank2 from "../assets/ranks/rank2.png";
import rank3 from "../assets/ranks/rank3.png";
import rank4 from "../assets/ranks/rank4.png";
import rank5 from "../assets/ranks/rank5.png";
import rank6 from "../assets/ranks/rank6.png";

export const calculateRank = (type, points) => {
    if (points <= 1050) {
      const obj = { rank: rank1, title: "Beginner" };
      return obj[type];
    } else if (points <= 1130) {
      const obj = { rank: rank2, title: "Great" };
      return obj[type];
    } else if (points <= 1240) {
      const obj = { rank: rank3, title: "Expert" };
      return obj[type];
    } else if (points <= 1380) {
      const obj = { rank: rank4, title: "Veteran" };
      return obj[type];
    } else if (points <= 1500) {
      const obj = { rank: rank5, title: "Ultra" };
      return obj[type];
    } else {
      const obj = { rank: rank6, title: "Master" };
      return obj[type];
    }
  };