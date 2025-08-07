import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import References from './components/References';
import Projects from './components/Projects';
import Pricing from './components/Pricing';
import ConversationalInterface from './components/ConversationalInterface';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="App">
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Features />
              <Pricing />
            </>
          } />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/references" element={<References />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/create-reference" element={<ConversationalInterface />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
