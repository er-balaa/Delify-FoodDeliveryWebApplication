import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [dbUser, setDbUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                try {
                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                    const res = await axios.post(`${apiUrl}/auth/sync`, {
                        firebaseUid: user.uid,
                        email: user.email,
                        name: user.displayName || 'User'
                    });
                    setDbUser(res.data);
                } catch (error) {
                    console.error("Failed to sync user with DB", error);
                }
            } else {
                setDbUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        dbUser,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div style={{
                    height: "100vh",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "var(--bg-body)",
                    color: "var(--primary)"
                }}>
                    <div style={{
                        width: "40px",
                        height: "40px",
                        border: "3px solid rgba(226, 55, 68, 0.3)",
                        borderRadius: "50%",
                        borderTopColor: "var(--primary)",
                        animation: "spin 1s ease-in-out infinite"
                    }}></div>
                    <style>{`
                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            ) : (
                children
            )}

        </AuthContext.Provider>
    );
};
