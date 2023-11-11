/* eslint-disable react/no-unescaped-entities */
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import "./Leaderboard.css";
import { getAllUsersDocuments } from "../../utils/firebase/firebase.utils";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading/Loading";
import SnackBar from "../../components/SnackBar/SnackBar";
import photoImg from "../../assets/profile.png";

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
        <div className="container mb-3">
          <table className="table table-dark text-center point-system-container">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Username</th>
                <th scope="col">Points</th>
              </tr>
            </thead>
            <tbody>
              {usersInfo.map((user, index) => (
                <tr key={user.displayName}>
                  <th scope="row">{index + 1}</th>
                  <td className="col-md-3">
                    <div className="d-flex justify-content-center">
                      <div className="me-4">
                        <span>{user.displayName}</span>
                      </div>
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
                    </div>
                  </td>
                  <td className="col-md-7">
                    <span> {user.points} </span>
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
