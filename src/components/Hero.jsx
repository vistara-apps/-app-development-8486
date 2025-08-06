import React from 'react';
import { Link } from 'react-router-dom';
import Button from './ui/Button';

function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <h1>Verifiable Work History</h1>
        <p>
          Portable, blockchain-based work history and references that stay with you forever.
          Build trust, showcase your contributions, and never lose your professional reputation.
        </p>
        <div className="flex gap-6 justify-center flex-wrap">
          <Link to="/dashboard">
            <Button size="lg" className="group">
              Get Started
            </Button>
          </Link>
          <a href="#features">
            <Button variant="secondary" size="lg" className="group">
              Learn More
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
