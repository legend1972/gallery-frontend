import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./styles.css";
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'; //Bootstrap CSS 전역 사용
import { BrowserRouter } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";
import { AuthProvider } from './context/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  // </StrictMode>
)
