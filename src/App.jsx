import React, { Fragment } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Auth from './layouts/Auth';
import Default from './layouts/Default';
import Login from './pages/Login';
import ClientList from './pages/ClientList';
import ClientForm from './pages/ClientForm';

function App() {
  return (
    <Fragment>
      <Routes>
        <Route path="/auth/*" element={<Auth />}>
          <Route path="login" element={<Login />} />
        </Route>
        <Route element={<Default />}>
          <Route path="/customers">
            <Route index element={ <ClientList /> } />
            <Route path="create" element={ <ClientForm /> } />
            <Route path=":id" element={ <ClientForm /> } />
          </Route>

          <Route path="*" element={<Navigate to="/customers" replace />} />
        </Route>
      </Routes>
      <ToastContainer />
    </Fragment>
  );
}

export default App;
