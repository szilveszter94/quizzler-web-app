/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import {
  onAuthStateChangedListener,
  createUserDocumentFromAuth,
  signOutUser,
} from "../utils/firebase/firebase.utils";

export const UserContext = createContext({
  currentUser: null,
  loading: true,
  setCurrentUser: () => null,
});

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const value = { currentUser, loading, setCurrentUser };

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(async (user) => {
      if (user) {
        setTimeout(async () => {
          const userDocRef = await createUserDocumentFromAuth(user);
          if (!userDocRef) {
            alert("Login failed, try again later.");
            signOutUser();
          }
        }, 2000);
      }
      if (user === null || (user && user.emailVerified)) {
        setCurrentUser(user);
      } else {
        signOutUser();
      }
      setLoading(false);
    });
    return unsubscribe;
  });

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
