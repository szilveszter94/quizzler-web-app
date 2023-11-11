/* eslint-disable react/no-unescaped-entities */
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import FormInput from "../../components/FormInput/FormInput";
import SnackBar from "../../components/SnackBar/SnackBar";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  passwordReset,
  checkIfEmailExists,
} from "../../utils/firebase/firebase.utils";

const PasswordReset = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "",
  });
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await checkIfEmailExists(email);
    if (response.ok) {
      const resetEmail = passwordReset(email);
      if (resetEmail) {
        setSubmitted(true);
        setSnackbar({ open: true, message: response.message, type: "success" });
      } else {
        setSnackbar({ open: true, message: "An error occured, try again.", type: "error" });
      }
    } else {
      setSnackbar({ open: true, message: response.message, type: "error" });
    }
  };

  return (
    <div className="main">
      <SnackBar
        {...snackbar}
        setOpen={() => setSnackbar({ ...snackbar, open: false })}
      />
      <Navbar />
      <div className="content">
        <div className="container">
          <div className="row text-center justify-content-center my-5">
            <div className="col-md-6">
              <div className="mx-5">
                <div>
                  <form className="sign-up-form p-4" onSubmit={handleSubmit}>
                    {submitted ? (
                      <p className="sign-up-subtitle">
                        Thank you! If the email address you provided is
                        associated with an account, you will receive an email
                        shortly with instructions on how to reset your password.
                      </p>
                    ) : (
                      <>
                        <p className="sign-up-subtitle">
                          Please enter the email address associated with your
                          account. We will send you a link to reset your
                          password to that email.
                        </p>
                        <FormInput
                          label="Email"
                          type="email"
                          name="email"
                          id="signupemail"
                          required
                          onChange={(event) => setEmail(event.target.value)}
                          value={email}
                        />
                      </>
                    )}
                    <div className="d-flex justify-content-center">
                      <Link
                        to="/authentication"
                        className="btn btn-outline-info ms-1 me-4 mt-4"
                        type="submit"
                      >
                        Back
                      </Link>
                      {submitted ? (
                        ""
                      ) : (
                        <button
                          className="btn btn-outline-info me-1 ms-4 mt-4"
                          type="submit"
                        >
                          Reset Password
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PasswordReset;
