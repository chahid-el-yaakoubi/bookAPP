import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css';
import './i18n';
// import { BrowserRouter } from 'react-router-dom';
import { SearchContextProvider } from './contextApi/SearchContext.jsx';
import { AuthContextProvider } from './contextApi/AuthContext.jsx';
import { TransContextProvider } from './contextApi/TransContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  
  <React.StrictMode>
    <TransContextProvider>
      <AuthContextProvider >
        <SearchContextProvider>
        <App />
        </SearchContextProvider>
      </AuthContextProvider>
    </TransContextProvider>
  </React.StrictMode>,
)
