import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";
const AuthContext = createContext(null);

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [authenticated, setAuthenticated] = useState(false);

    /**
     * 현재 로그인 사용자 조회
     */
    const fetchUser = async () => {
        try {
            const response = await api.get("/member/me");

            setUser(response.data?.data ?? null);
            setAuthenticated(true);

            return true;
        } catch (error) {
            setUser(null);
            setAuthenticated(false);

            return false;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    /**
     * 로그아웃 처리
     */
    const logout = async () => {
        try {
            const response = await api.post("/member/logout");
            console.log(response.data?.message ?? "로그아웃 성공");
        } catch (error) {
            console.error(error.response?.data?.message ?? "로그아웃 실패");
        } finally {
                setUser(null);
                setAuthenticated(false);
            }
        };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                fetchUser,
                logout,
                authenticated
            }}>
                {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}