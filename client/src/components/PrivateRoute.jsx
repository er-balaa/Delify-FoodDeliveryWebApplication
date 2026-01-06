import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
    const { currentUser, loading } = useAuth(); // Now we can pluck loading from context

    if (loading) {
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-body)', color: 'white' }}>Loading...</div>;
    }

    return currentUser ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
