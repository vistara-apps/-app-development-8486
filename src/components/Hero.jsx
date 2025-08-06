import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <h1>Verifiable Work History</h1>
        <p>
          Portable, blockchain-based work history and references that stay with you forever.
          Build trust, showcase your contributions, and never lose your professional reputation.
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <Link to="/dashboard" className="btn">
            Get Started
          </Link>
          <a href="#features" className="btn btn-secondary">
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;