import React from 'react';
import { Link } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';

function Header({ isLoggedIn, setIsLoggedIn }) {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            BlockRef
          </Link>
          <nav className="nav">
            {isLoggedIn && (
              <>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/profile">Profile</Link>
                <Link to="/references">References</Link>
                <Link to="/projects">Projects</Link>
              </>
            )}
            <ConnectButton />
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;