/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { auth } from "../utils/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const logout = () => signOut(auth);

export const AuthProvider = ({ children }) => {
  const [ currentUser, setCurrentUser ] = useState();
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(``);

  const createAccount = async (email, password) => await createUserWithEmailAndPassword(auth, email, password);
  const login = async (email, password) => await signInWithEmailAndPassword(auth, email, password);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo(() =>
    ({ currentUser, login, createAccount, error, setError, logout }),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [ currentUser, login, createAccount, error, setError, logout ]);

  console.log(currentUser);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};