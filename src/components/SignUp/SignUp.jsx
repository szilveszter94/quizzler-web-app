/* eslint-disable react/no-unescaped-entities */
import FormInput from "../FormInput/FormInput";
import { useState } from "react";
import {
  createUserDocumentWithEmailAndPassword,
  createUserDocumentFromAuth,
  checkDuplicatedDisplayNames,
} from "../../utils/firebase/firebase.utils";
import "./SignUp.css";
import SnackBar from "../SnackBar/SnackBar";

const defaultFormFields = {
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const SignUp = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { displayName, email, password, confirmPassword } = formFields;
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password === confirmPassword) {
      try {
        const response = await checkDuplicatedDisplayNames(displayName);
        if (response.ok) {
          const { user } = await createUserDocumentWithEmailAndPassword(
            email,
            password
          );
          const userDocument = await createUserDocumentFromAuth(user, {
            displayName,
          });
          if (userDocument) {
            setFormFields(defaultFormFields);
            setSnackbar({ open: true, message: "Email verification sent to your email account.", type: "info" });
          }
        } else {
          setSnackbar({ open: true, message: response.message, type: "error" });
        }
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          setSnackbar({ open: true, message: "Cannot create user, email already in use. Try to login with your email.", type: "error" });
        }
        console.log("user creation encountered an error", error);
      }
    } else {
      setSnackbar({ open: true, message: "Passwords do not match.", type: "error" });
      return;
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <div>
      <SnackBar
        {...snackbar}
        setOpen={() => setSnackbar({ ...snackbar, open: false })}
      />
      <h1 className="sign-up-title mb-5">Don't have an account?</h1>
      <form className="sign-up-form p-4" onSubmit={handleSubmit}>
        <p className="mb-4 sign-up-subtitle">
          Sign up with your email and password
        </p>
        <FormInput
          label="Nickname"
          type="text"
          name="displayName"
          required
          id="displayname"
          onChange={handleChange}
          value={displayName}
        />
        <FormInput
          label="Email"
          type="email"
          name="email"
          id="signupemail"
          required
          onChange={handleChange}
          value={email}
        />
        <FormInput
          label="Password"
          minLength={8}
          type="password"
          name="password"
          id="signuppassword"
          required
          onChange={handleChange}
          value={password}
        />
        <FormInput
          label="Confirm Password"
          minLength={8}
          type="password"
          id="confirmpassword"
          name="confirmPassword"
          required
          onChange={handleChange}
          value={confirmPassword}
        />
        <button className="btn btn-outline-info btn-lg mt-4" type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
