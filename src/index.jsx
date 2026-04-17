import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './Pages/home';
import A from './Pages/Ab';
// import A from './Pages/A';

const publicRoute = createBrowserRouter([{
  path: '/',
  element: <App />,
  children: [
    { path: '/', element: <Home /> },
    { path: '/home', element: <Home /> },
    { path: '/a', element: <A /> },

  ]
}])

const protectedRoute = createBrowserRouter([{
  path: '/',
  element: <App />,
  children: [
    { path: '/', element: <Home /> },
    { path: '/a', element: <A /> },
  ]
}])

const route = localStorage.getItem("@1app/displayname") === null ? publicRoute : protectedRoute

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={route} />
  </React.StrictMode>
);

