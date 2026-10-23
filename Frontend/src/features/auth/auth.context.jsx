import { useEffect, useState, createContext } from "react";
import { getMe } from "./services/auth.api";



export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function loadUser() {
            try {
                const data = await getMe();
                if (isMounted) {
                    setUser(data.user);
                }
            } catch (error) {
                if (isMounted) {
                    setUser(null);
                }
                if (error.response?.status !== 401) {
                    console.error("Could not restore the signed-in user", error);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadUser();
        return () => {
            isMounted = false;
        };
    }, []);



    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading, authError, setAuthError }}>
            {children}
        </AuthContext.Provider>
    );
};