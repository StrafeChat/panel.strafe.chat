"use client";
import { createContext, useContext, useState } from "react";

interface UserContextType {
    user: any;
    setUser: (user: any) => void;
}

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => { },
});

export const useAuth = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: JSX.Element }) => {
    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
