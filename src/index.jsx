import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './Pages/home';

const publicRoute = createBrowserRouter([{
  path: '/',
  element: <App />,
  children: [
    { path: '/', element: <Home /> },
    { path: '/home', element: <Home /> },
    // { path: '/login', element: <Login /> },
    // { path: '/*', element: <ErrorPage /> },
    // { path: '/loading', element: <Loading /> },
  ]
}])

const protectedRoute = createBrowserRouter([{
  path: '/',
  element: <App />,
  children: [
    { path: '/', element: <Home /> },
    { path: '/home', element: <Home /> },
    // { path: '/users', element: <Jobs /> },
    // { path: '/users/:id', element: <UserDetails /> },
    // { path: '/jobs/:obsId', element: <JobDetail /> },
    // { path: '/newuser', element: <NewUser /> },
    // { path: '/logout', element: <Logout /> },
    // { path: '/NewJob', element: <NewJob /> },
    // { path: '/*', element: <ErrorPage /> },
    // { path: '/criterios', element: <Criterios /> },
  ]
}])

const route = localStorage.getItem("@1app/displayname") === null ? publicRoute : protectedRoute

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={route} />
  </React.StrictMode>
);

