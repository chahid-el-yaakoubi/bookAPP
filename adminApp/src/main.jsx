import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { DarkModeContextProvider } from './context/darkModeContext'
import { AuthContextProvider } from './pages/context/AuthContect'
import { sideContextProvider } from './pages/context/sidePar'
import './index.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DarkModeContextProvider>
      <sideContextProvider>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </sideContextProvider>
    </DarkModeContextProvider>
  </React.StrictMode>
)
