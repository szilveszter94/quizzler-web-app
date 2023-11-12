/* eslint-disable react/no-unescaped-entities */
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import "./Leaderboard.css";
import { getAllUsersDocuments } from "../../utils/firebase/firebase.utils";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading/Loading";
import SnackBar from "../../components/SnackBar/SnackBar";
import photoImg from "../../assets/profile.png";
import { calculateRank } from "../../utils/calculateRank";

const Leaderboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [usersInfo, setUsersInfo] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "",
  });
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      const response = await getAllUsersDocuments();
      if (response.ok) {
        setUsersInfo(response.data);
      } else {
        setSnackbar({ open: true, message: response.message, type: "error" });
      }
      setIsLoading(false);
    };
    loadUsers();
  }, []);

  const calculateStyle = (index, type) => {
    if (index === 0) {
      const obj = { color: "gold", size: "30px" };
      return obj[type];
    } else if (index === 1) {
      const obj = { color: "silver", size: "28px" };
      return obj[type];
    } else if (index === 2) {
      const obj = { color: "brown", size: "26px" };
      return obj[type];
    } else {
      const obj = { color: "white", size: "20px" };
      return obj[type];
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="main">
      <Navbar />
      <SnackBar
        {...snackbar}
        setOpen={() => setSnackbar({ ...snackbar, open: false })}
      />
      <div className="container my-5 content">
        <div className="container">
          <h1 className="mb-4 text-center leaderboard-title">Leaderboard</h1>
        </div>
        <div className="container text-center w-75 lead mb-5">
          <p>
            Introducing the epic battleground where champions are born and
            legends are made our game leaderboard! Step into a world where
            skill, strategy, and determination collide, as players from across
            the globe vie for supremacy.
          </p>
        </div>
        <hr />
        <div className="table-responsive mb-3">
          <table className="table table-dark text-center point-system-container">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col"></th>
                <th scope="col">Username</th>
                <th scope="col">Points</th>
                <th scope="col">Rank</th>
                <th scope="col">Medal</th>
              </tr>
            </thead>
            <tbody>
              {usersInfo.map((user, index) => (
                <tr
                  style={{
                    fontSize: calculateStyle(index, "size"),
                  }}
                  key={user.displayName}
                >
                  <th scope="row">
                    <span
                      style={{
                        color: calculateStyle(index, "color"),
                      }}
                    >
                      {index + 1}
                    </span>
                  </th>
                  <td>
                    <div className="image-container">
                      <img
                        src={
                          user.photoURL
                            ? imageError
                              ? photoImg
                              : user.photoURL
                            : photoImg
                        }
                        alt="User Avatar"
                        onError={() => setImageError(true)}
                        className="leaderboard-profile-image"
                      />
                    </div>
                  </td>
                  <td className="col-md-3">
                    <span>{user.displayName}</span>
                  </td>
                  <td className="col-md-7">
                    <span> {user.points} </span>
                  </td>
                  <td>
                    <span className="ms-1">
                      {calculateRank("title", user.points)}
                    </span>
                  </td>
                  <td className="col-md-7">
                    <img
                      className="leaderboard-rank-image"
                      src={calculateRank("rank", user.points)}
                      alt="Master"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Leaderboard;
