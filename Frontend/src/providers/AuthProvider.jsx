import { createContext, useState, useEffect } from "react";
import AuthApi from "../api/authApi";

const AuthContext = createContext({
    currentUser: {},
    setCurrentUser: () => {},
});

export const AuthProvider = ({ children }) => {

    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => {
        const user = AuthApi.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
        {children}
        </AuthContext.Provider>
    );
};

