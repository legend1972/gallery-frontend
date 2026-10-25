import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';

import LoginPage from "./components/login/LoginPage";
import HomePage from './components/home/HomePage';
import SignUpPage from "./components/signup/SignUpPage";
import FavoriteArtworksPage from './components/artwork/FavoriteArtworksPage';
import ArtworkExhibitionPage from './components/artwork/ArtworkExhibitionPage';
import ArtistApplPage from './components/artist/ArtistApplPage';
import ArtistJdgmnPage from './components/admin/artist/ArtistJdgmnPage';
import ArtistJdgmnDetailPage from './components/admin/artist/ArtistJdgmnDetailPage';
import MobileLayout from './components/layouts/MobileLayout';
import NtcnDetail from './components/ntcn/NtcnDetail';
import NtcnSetupDetail from './components/ntcn/NtcnSetupDetail';
import ArtistProfileManagePage from './components/artist/ArtistProfileManagePage';
import AllMenuPage from './components/common/AllMenuPage';

import api from "./api/api";
import { useAuth } from './context/AuthContext';
import ArtistPrdctActRegister from './components/artist/ArtistPrdctActRegister';
import ArtistPrdctActManagePage from './components/artist/ArtistPrdctActManagePage';

const componentMap = {
  M0002: FavoriteArtworksPage,
  M0003: ArtworkExhibitionPage,
  M0004: ArtistApplPage,
  M0005: ArtistProfileManagePage,
  M0006: ArtistPrdctActManagePage,
  M4001: ArtistJdgmnPage,
  M4002: ArtistJdgmnDetailPage,
  M4003: ArtistPrdctActRegister,
  M9901: NtcnDetail,
  M9902: NtcnSetupDetail,
  M9999: AllMenuPage,
};

/**
 * 로그인이 필요한 화면 보호
 */
function ProtectedRoute({ authenticated, children }) {

    const location = useLocation();

    if (!authenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    return children;
}

function App() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * authRoutes: 로그아웃 처리 시 useEffect 수행
   * initialize: 로그인 처리 시 useEffect 수행
   */
  const {authenticated, fetchUser, authRoutes} = useAuth();
  
  const initialize = useCallback(async () => {
    try {
      const response = await api.get("/role/routes");
      
      setRoutes(response.data.data ?? []);

    } catch (error) {
      console.error("라우트 조회 오류:", error);
      setRoutes([]);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const init = async () => {
      try {
        await fetchUser();
        if (active) {
          await initialize();
        }
      } catch (error) {
            console.error("초기화 오류:", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    init();

    return () => {
      active = false;
    };

  }, [authRoutes, initialize]);

  if (loading) {
    return <div>Loading ...</div>;
  }

  return (
      <Routes>
        <Route
          element={<MobileLayout showHeader={true} showBottom={true} routes={routes}/>}>
          <Route
            path="/login"
            element= {
              authenticated
                ? <Navigate to="/" replace />
                : <LoginPage onLoginSuccess={initialize}/>}
          />

          <Route
            path="/signup"
            element={
              authenticated
              ? <Navigate to="/" replace />
              : <SignUpPage/>}
          />

          <Route
            path="/"
            element={<HomePage/>}
          />
        </Route>

        {routes.filter(route => route.menuUrl !== "/" && route.menuUrl !== "/signup" && route.menuUrl !== "/login" ).map(route => {
          const Component = componentMap[route.menuId];

          if(!Component) {
            console.warn(
              `componentMap에 등록되지 않은 메뉴입니다: ${route.menuId}`
            );

            return null;
          }
          
          const loginRequired = route.loginNeedAt === "Y";

          return (
              <Route key={route.menuId} element={<MobileLayout showHeader={route.upendUseAt === "Y"} showBottom={route.lptUseAt === "Y"} routes={routes}/>}>
                  <Route
                    path={route.menuUrl}
                    element={loginRequired ? (
                      <ProtectedRoute authenticated={authenticated}>
                        <Component/>
                      </ProtectedRoute>
                    ): (
                      <Component/>
                    )
                  }
                  />
              </Route>
          );
        })}

        <Route
          path="*"
          element={
            authenticated
            ? <div>접근할 수 없는 페이지입니다.</div>
            : <Navigate to="/login" replace />
          }
        />
      </Routes>
  );
}

export default App;