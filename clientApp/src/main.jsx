import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css';
import './i18n';
import { Provider } from 'react-redux';
import store from './redux/store.js';
// import { BrowserRouter } from 'react-router-dom';
import { SearchContextProvider } from './contexts/SearchContext.jsx';
import { AuthContextProvider } from './contexts/AuthContext.jsx';
import { TransContextProvider } from './contexts/TransContext.jsx';
import { MoroccanExperiences } from './components/moroccanExperiences/MoroccanExperiences.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <React.StrictMode>
    <TransContextProvider>
      <AuthContextProvider >
        <SearchContextProvider>
        <App />
        </SearchContextProvider>
      </AuthContextProvider>
    </TransContextProvider>
  </React.StrictMode>
  </Provider> ,
)

