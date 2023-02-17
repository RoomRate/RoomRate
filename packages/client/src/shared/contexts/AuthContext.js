import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { auth } from "../utils/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { AsyncPageWrapper } from "../A-UI/AsyncPageWrapper";
import { UserService } from "../services";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }

  return context;
};

export const AuthProvider = ({ children }) => {
  const [ currentUser, setCurrentUser ] = useState();
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(``);

  const createAccount = useCallback(async (email, password) =>
    await createUserWithEmailAndPassword(auth, email, password), []);

  const login = useCallback(async (email, password) =>
    await signInWithEmailAndPassword(auth, email, password), []);

  const logout = useCallback(() => signOut(auth), []);

  useEffect(() => {
    const fetchData = async ({ uid }) => await UserService.getUserFromFirebaseUid({ uid });

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userData = await fetchData({ uid: user.uid });
        setCurrentUser({ ...user, ...userData });
        setLoading(false);
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo(() =>
    ({ currentUser, login, createAccount, error, setError, logout }),
  [ currentUser, login, createAccount, error, setError, logout ]);

  return (
    <AsyncPageWrapper status="success">
      <AuthContext.Provider value={value}>
        {!loading && children}
      </AuthContext.Provider>
    </AsyncPageWrapper>
  );
};