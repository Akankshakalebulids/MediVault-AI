import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, isFirebaseConfigured } from "../firebaseConfig.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";

const AuthContext = createContext(null);

const DEFAULT_DEMO_USER = {
  uid: "demo_user_akanksha",
  displayName: "Akanksha K.",
  email: "akanksha.student@medivault.ai",
  bloodGroup: "O+",
  dob: "2003-05-14",
  emergencyContact: "+91 98765 43210 (Mother)",
  isDemo: true
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    // Check if user has a saved demo session or start with demo user
    const saved = localStorage.getItem("medivault_auth_user");
    return saved ? JSON.parse(saved) : DEFAULT_DEMO_USER;
  });
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          const formatted = {
            uid: user.uid,
            displayName: user.displayName || user.email.split("@")[0],
            email: user.email,
            bloodGroup: "O+",
            emergencyContact: "+91 98765 43210",
            isDemo: false
          };
          setCurrentUser(formatted);
          localStorage.setItem("medivault_auth_user", JSON.stringify(formatted));
        } else {
          // Fall back to default demo user if unauthenticated
          setCurrentUser(DEFAULT_DEMO_USER);
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      setLoading(false);
    }
  }, []);

  async function login(email, password) {
    setAuthError(null);
    if (isFirebaseConfigured && auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        return cred.user;
      } catch (err) {
        setAuthError(err.message);
        throw err;
      }
    } else {
      // Mock Demo Login
      const mockUser = {
        uid: `user_${Date.now()}`,
        displayName: email.split("@")[0],
        email: email,
        bloodGroup: "B+",
        emergencyContact: "Emergency Care Contact",
        isDemo: true
      };
      setCurrentUser(mockUser);
      localStorage.setItem("medivault_auth_user", JSON.stringify(mockUser));
      return mockUser;
    }
  }

  async function register(email, password, displayName) {
    setAuthError(null);
    if (isFirebaseConfigured && auth) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName) {
          await updateProfile(cred.user, { displayName });
        }
        return cred.user;
      } catch (err) {
        setAuthError(err.message);
        throw err;
      }
    } else {
      // Mock Demo Registration
      const mockUser = {
        uid: `user_${Date.now()}`,
        displayName: displayName || email.split("@")[0],
        email: email,
        bloodGroup: "A+",
        emergencyContact: "+91 98765 00000",
        isDemo: true
      };
      setCurrentUser(mockUser);
      localStorage.setItem("medivault_auth_user", JSON.stringify(mockUser));
      return mockUser;
    }
  }

  async function logout() {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    setCurrentUser(DEFAULT_DEMO_USER);
    localStorage.removeItem("medivault_auth_user");
  }

  function enterDemoMode() {
    setCurrentUser(DEFAULT_DEMO_USER);
    localStorage.setItem("medivault_auth_user", JSON.stringify(DEFAULT_DEMO_USER));
  }

  const value = {
    currentUser,
    loading,
    authError,
    isFirebaseConfigured,
    isDemoMode: Boolean(!isFirebaseConfigured || currentUser?.isDemo),
    login,
    register,
    logout,
    enterDemoMode
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
