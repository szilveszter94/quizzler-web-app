/* eslint-disable react-hooks/exhaustive-deps */
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/userContext";
import {
  getUserProfileData,
  uploadPhoto,
  changeUserInfo,
  checkDuplicatedDisplayNames,
} from "../../utils/firebase/firebase.utils";
import Loading from "../../components/Loading/Loading";
import photoImg from "../../assets/profile.png";
import "./Profile.css";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SnackBar from "../../components/SnackBar/SnackBar";
import { calculateRank } from "../../utils/calculateRank";

const Profile = () => {
  const { currentUser } = useContext(UserContext);
  const [originalDisplayName, setOriginalDisplayName] = useState(false);
  const [userInfo, setUserInfo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [percentage, setPercentage] = useState(0);
  const [color, setColor] = useState("rgb(255, 255, 255)");
  const [edit, setEdit] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "",
  });

  const getUserInfo = async () => {
    try {
      const data = await getUserProfileData(currentUser);
      setUserInfo(data);
      setOriginalDisplayName(data.displayName);
      const { profile } = data;
      const rating = (
        (profile.good_answers * 100) /
        Math.max(profile.good_answers + profile.false_answers, 1)
      ).toFixed(0);
      if (profile.quizzes_played === 0) {
        setColor(`rgb(255, 255, 255)`);
      } else if (rating <= 40) {
        setColor(`rgb(${255 - rating}, ${rating}, 0)`);
      } else if (rating <= 80) {
        setColor(`rgb(${255 - Math.floor(rating / 2)}, ${185 + rating}, 0)`);
      } else {
        setColor(`rgb(${100 - rating}, ${155 + rating}, 0)`);
      }
      setPercentage(rating);
      setLoading(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Profile not loaded.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const response = await uploadPhoto(file, currentUser);
      if (response.ok) {
        setUserInfo({
          ...userInfo,
          profile: { ...userInfo.profile, photoURL: response.photoUrl },
        });
        setImageError(false);
        setSnackbar({ open: true, message: response.message, type: "success" });
      } else {
        setSnackbar({ open: true, message: response.message, type: "error" });
      }
    }
  };

  const handleEdit = (event) => {
    const newName = event.target.value;
    setUserInfo({ ...userInfo, displayName: newName });
  };

  const handleCancel = () => {
    setEdit(false);
    setUserInfo({ ...userInfo, displayName: originalDisplayName });
  };

  const handleSubmit = async () => {
    if (originalDisplayName !== userInfo.displayName) {
      const checkDuplicated = await checkDuplicatedDisplayNames(
        userInfo.displayName
      );
      if (checkDuplicated.ok) {
        const response = await changeUserInfo(userInfo);
        if (response.ok) {
          setSnackbar({
            open: true,
            message: response.message,
            type: "success",
          });
          setEdit(false);
          setOriginalDisplayName(userInfo.displayName);
        } else {
          setSnackbar({ open: true, message: response.message, type: "error" });
        }
      } else {
        setSnackbar({
          open: true,
          message: checkDuplicated.message,
          type: "error",
        });
      }
    } else {
      setSnackbar({
        open: true,
        message: "Profile uploaded successfully.",
        type: "success",
      });
      setEdit(false);
    }
  };


  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="main">
          <Navbar />
          <div className="content">
            <SnackBar
              {...snackbar}
              setOpen={() => setSnackbar({ ...snackbar, open: false })}
            />
            <div className="profile-page container text-center mt-5">
              <div className="profile-card">
                <div className="edit-container text-start">
                  {edit ? (
                    ""
                  ) : (
                    <button
                      onClick={() => {
                        setEdit(true);
                      }}
                      className="btn btn-outline-info"
                    >
                      Edit profile
                    </button>
                  )}
                </div>
                <div className="row align-items-center">
                  <div className="col-md-4">
                    <div className="d-flex justify-content-center">
                      <h4>Points: {userInfo.profile.points}</h4>
                    </div>
                  </div>
                  <div className="image-container col-md-4">
                    <img
                      src={
                        userInfo.profile.photoURL
                          ? imageError
                            ? photoImg
                            : userInfo.profile.photoURL
                          : photoImg
                      }
                      alt="User Avatar"
                      onError={() => setImageError(true)}
                      className="profile-image"
                    />
                    {edit ? (
                      <div className="profile-image-edit">
                        <label
                          htmlFor="profilePhotoInput"
                          className="edit-icon fs-5"
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </label>
                        <input
                          onChange={handleUpload}
                          type="file"
                          id="profilePhotoInput"
                          accept="image/*"
                          hidden
                        />
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="col-md-4">
                    <div className="container d-flex justify-content-center">
                      <div className="text-center">
                        <img
                          className="rank-image"
                          src={calculateRank("rank", userInfo.profile.points)}
                          alt="Master"
                        />
                        <h4 className="rank-text ">{calculateRank("title", userInfo.profile.points)}</h4>
                      </div>
                    </div>
                  </div>
                </div>
                {edit ? (
                  <>
                    <div className="d-flex justify-content-center mb-3">
                      <input
                        onChange={handleEdit}
                        className="form-control w-50"
                        value={userInfo.displayName}
                      />
                    </div>
                    <div className="d-flex justify-content-center mb-2">
                      <button
                        onClick={handleSubmit}
                        className="btn btn-outline-success mx-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="btn btn-sm btn-outline-info mx-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <h2 className="profile-name">{userInfo.displayName}</h2>
                )}
                <p className="profile-email">Email address: {userInfo.email}</p>
                <div className="row">
                  <div className="col-md-3 profile-stat">
                    <div className="mx-2">
                      <h3>Quizzes Played</h3>
                      <p>{userInfo.profile.quizzes_played}</p>
                    </div>
                  </div>
                  <div className="col-md-3 profile-stat">
                    <div className="mx-2">
                      <h3>Quizzes Completed</h3>
                      <p>{userInfo.profile.quizzes_completed}</p>
                    </div>
                  </div>
                  <div className="col-md-3 profile-stat">
                    <div className="mx-2">
                      <h3>Good Answers</h3>
                      <p className="good-answers">
                        {userInfo.profile.good_answers}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-3 profile-stat">
                    <div className="mx-2">
                      <h3>False Answers</h3>
                      <p className="bad-answers">
                        {userInfo.profile.false_answers}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3>Accuracy</h3>
                  <h1 style={{ color: color }}>{percentage}%</h1>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default Profile;
