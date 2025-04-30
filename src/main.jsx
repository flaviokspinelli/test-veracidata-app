import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import App from './App';
import AuthProvider from './context/AuthContext';
import CustomerContext from './context/CustomerContext';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './index.css';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

if(localStorage.token) {
  axios.defaults.headers.common['Authorization'] = 'Token ' + localStorage.token;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CustomerContext>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CustomerContext>
    </AuthProvider>
  </React.StrictMode>
);
