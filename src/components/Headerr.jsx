import React, { useState, useEffect } from 'react';
// import { NavLink } from 'react-router-dom';
import sapaLogo from '../assets/sapa.png';

function Cabeca() {
  const [scrolled, setScrolled] = useState(false);
  // const isLoggedIn = localStorage.getItem('@1app/displayname') !== null;
  // const displayName = localStorage.getItem('@1app/displayname');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`cabeca-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="cabeca-brand">
        <img src={sapaLogo} alt="Sapa Logo" className="cabeca-logo" />
        <div className="cabeca-titles">
          <span className="cabeca-title">Empenho</span>
          <span className="cabeca-subtitle">Sistema de monitoramento</span>
        </div>
      </div>

      {/* <nav className="cabeca-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `cabeca-link ${isActive ? 'active' : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          Home
        </NavLink>

        {isLoggedIn ? (
          <>
            <NavLink
              to="/newjob"
              className={({ isActive }) => `cabeca-link ${isActive ? 'active' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              New Job
            </NavLink>

            <NavLink
              to="/logout"
              className={({ isActive }) => `cabeca-link cabeca-link-logout ${isActive ? 'active' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
              </svg>
              {displayName}
            </NavLink>
          </>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) => `cabeca-link cabeca-link-login ${isActive ? 'active' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
            Login
          </NavLink>
        )}
      </nav> */}
    </header>
  );
}

export default Cabeca;