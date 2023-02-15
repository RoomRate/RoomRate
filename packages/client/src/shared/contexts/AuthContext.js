
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { auth } from "../utils/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { AsyncPageWrapper } from "../A-UI/AsyncPageWrapper";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }

  return context;
};

export const AuthProvider = ({ children }) => {
  const [ currentUser, setCurrentUser ] = useState(JSON.parse(localStorage.getItem(`user`)));
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(``);

  const createAccount = useCallback(async (email, password) =>
    await createUserWithEmailAndPassword(auth, email, password), []);

  const login = useCallback(async (email, password) =>
    await signInWithEmailAndPassword(auth, email, password), []);

  const logout = useCallback(() => signOut(auth), []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    console.log(currentUser);
  }, [ loading ]);

  const value = useMemo(() =>
    ({ currentUser, login, createAccount, error, setError, logout }),
  [ currentUser, login, createAccount, error, setError, logout ]);

  return (
    <AsyncPageWrapper status="success">
      <AuthContext.Provider value={value} >
        {!loading && children}
      </AuthContext.Provider>
    </AsyncPageWrapper>
  );
};