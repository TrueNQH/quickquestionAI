import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './contexts/AuthContext.jsx';
const clientId = '528681207992-hfe1vjnln3bhhn8stliuk433a01mou9b.apps.googleusercontent.com';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>

    <GoogleOAuthProvider clientId={clientId}>
    <App />
  </GoogleOAuthProvider>
    </AuthProvider>
  </StrictMode>,
)
