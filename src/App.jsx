import { Routes, Route, Navigate } from 'react-router-dom';

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

import { useCallback, useEffect, useState } from 'react';

import api from "./api/api";
import { useAuth } from './context/AuthContext';
import NtcnSetupDetail from './components/ntcn/NtcnSetupDetail';
import ArtistProfileRegister from './components/artist/ArtistProfileRegister';

const componentMap = {
  M0001: HomePage,
  M0002: FavoriteArtworksPage,
  M0003: ArtworkExhibitionPage,
  M0004: ArtistApplPage,
  M0005: ArtistProfileRegister,
  M4001: ArtistJdgmnPage,
  M4002: ArtistJdgmnDetailPage,
  M9901: NtcnDetail,
  M9902: NtcnSetupDetail,
};

function App() {
  const [routes, setRoutes] = useState([]);
  const {authenticated, fetchUser} = useAuth();
  // const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const initialize = useCallback(async () => {
    try {
      const response = await api.get("/role/routes");
      
      setRoutes(response.data.data ?? []);
    } catch (error) {
      if(error.response?.status === 401) {
        setRoutes([]);
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const loginYn =
        await fetchUser();
      if (loginYn) {
        await initialize();

      } else {
        setRoutes([]);
        setLoading(false);
      }
    };

    init();

  }, []);

  if(loading) {
    return <div>Loading ...</div>;
  }

  return (
      <Routes>
        <Route
          path="/login"
          element= {
            authenticated
              ? <Navigate to="/" replace />
              : <LoginPage onLoginSuccess={initialize}/>}/>

        <Route
          path="/signup"
          element={
            authenticated
            ? <Navigate to="/" replace />
            : <SignUpPage/>}
        />

        {authenticated && routes.map(route => {
          const Component = componentMap[route.menuId];

          if(!Component) {
            console.warn(
              `componentMap에 등록되지 않은 메뉴입니다: ${route.menuId}`
            );

            return null;
          }
          
          return (
            <Route
              key={route.menuId}
              path={route.menuUrl}
              element={
                <MobileLayout showHeader={route.upendUseAt === "Y"} showBottom={route.lptUseAt === "Y"} routes={routes}>
                  <Component/>
                </MobileLayout>
              }
            />
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