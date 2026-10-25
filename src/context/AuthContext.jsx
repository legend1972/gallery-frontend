import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api from "../api/api";
const AuthContext = createContext(null);

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [authenticated, setAuthenticated] = useState(false);
    const [authRoutes, setAuthRoutes] = useState([]);

    /**
     * 현재 로그인 사용자 조회
     */
    const fetchUser = async () => {
        try {
            const response = await api.get("/member/me");

            const data = response.data?.data;
            setUser(response.data?.data ?? null);
            
            if(!data) {
                setAuthenticated(false);
            } else {
                setAuthenticated(true);
            }
        } catch (error) {
            if(error.response?.status === 401) {
                
                setUser(null);
                setAuthenticated(false);
                return;
            }
        } finally {
            setLoading(false);
        }
    };

    useCallback(() => {
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
                setAuthRoutes([]);
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
                authenticated,
                authRoutes,
            }}>
                {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}