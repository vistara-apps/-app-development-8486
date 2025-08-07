import React, { useState, useEffect } from 'react';
import { usePaymentContext } from '../hooks/usePaymentContext';
import { useReferenceStorage } from '../hooks/useIrys';
import ConversationalInterface from './ConversationalInterface';

function References() {
  const [paid, setPaid] = useState(false);
  const [showCreateInterface, setShowCreateInterface] = useState(false);
  const [storedReferences, setStoredReferences] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { createSession } = usePaymentContext();
  const { isReady, balance, error: irysError } = useReferenceStorage();

  const references = [
    {
      id: 1,
      from: 'Sarah Johnson',
      position: 'Engineering Manager at TechCorp',
      project: 'E-commerce Platform Redesign',
      rating: 5,
      description: 'Alex delivered exceptional work on our platform redesign. Their technical skills and attention to detail were outstanding.',
      status: 'verified',
      date: '2023-11-15'
    },
    {
      id: 2,
      from: 'Mike Chen',
      position: 'CTO at StartupXYZ',
      project: 'Mobile App Development',
      rating: 5,
      description: 'Excellent developer with strong problem-solving skills. Always delivered high-quality code on time.',
      status: 'verified',
      date: '2023-10-20'
    },
    {
      id: 3,
      from: 'Jennifer Brown',
      position: 'Product Manager at InnovateLab',
      project: 'Analytics Dashboard',
      rating: 4,
      description: 'Great collaboration and technical execution. Alex understood our requirements perfectly.',
      status: 'pending',
      date: '2023-12-01'
    }
  ];

  const handleRequestReference = async () => {
    try {
      await createSession();
      setPaid(true);
      alert('Reference request payment successful! Your request has been sent.');
    } catch (error) {
      alert('Payment failed. Please try again.');
      console.error('Payment error:', error);
    }
  };

  const handleCreateBlockchainReference = () => {
    setShowCreateInterface(true);
  };

  const handleReferenceCreated = (result) => {
    console.log('Reference created:', result);
    setShowCreateInterface(false);
    // Refresh references list or add to local state
    setStoredReferences(prev => [...prev, result.reference]);
  };

  if (showCreateInterface) {
    return (
      <div className="dashboard">
        <div className="container">
          <div className="main-content">
            <div style={{ marginBottom: '20px' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowCreateInterface(false)}
              >
                ← Back to References
              </button>
            </div>
            <ConversationalInterface 
              onComplete={handleReferenceCreated}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="main-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1 style={{ color: '#1a202c' }}>References</h1>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn" onClick={handleRequestReference}>
                Request New Reference ($2)
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleCreateBlockchainReference}
                disabled={!isReady}
              >
                Create Blockchain Reference
              </button>
            </div>
          </div>

          {irysError && (
            <div className="section" style={{ background: '#fef2f2', border: '1px solid #fca5a5', marginBottom: '20px' }}>
              <h3 style={{ color: '#dc2626' }}>Irys Connection Error</h3>
              <p>Unable to connect to Irys network: {irysError}</p>
              <p>Please ensure your wallet is connected and try again.</p>
            </div>
          )}

          {isReady && balance && (
            <div className="section" style={{ background: '#f0f9ff', border: '1px solid #0ea5e9', marginBottom: '20px' }}>
              <h3 style={{ color: '#0369a1' }}>Irys Storage Balance</h3>
              <p>Current balance: <strong>{balance.eth} ETH</strong></p>
              <p>You can create blockchain-verified references that will be stored permanently.</p>
            </div>
          )}

          <div className="section">
            <h2>Verified References ({references.filter(r => r.status === 'verified').length})</h2>
            
            {references.map((reference) => (
              <div key={reference.id} className="reference-item">
                <div className="reference-header">
                  <div>
                    <h4>{reference.from}</h4>
                    <p style={{ color: '#6b7280' }}>{reference.position}</p>
                  </div>
                  <span className={`reference-status status-${reference.status}`}>
                    {reference.status}
                  </span>
                </div>
                
                <p><strong>Project:</strong> {reference.project}</p>
                <p><strong>Rating:</strong> {'★'.repeat(reference.rating)}{'☆'.repeat(5-reference.rating)}</p>
                <p style={{ marginTop: '10px' }}>{reference.description}</p>
                <p style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '10px' }}>
                  Received: {reference.date}
                </p>
              </div>
            ))}
          </div>

          <div className="section">
            <h2>Reference Analytics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-number">{references.length}</span>
                <span className="stat-label">Total References</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{references.filter(r => r.status === 'verified').length}</span>
                <span className="stat-label">Verified</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{(references.reduce((sum, r) => sum + r.rating, 0) / references.length).toFixed(1)}</span>
                <span className="stat-label">Average Rating</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">100%</span>
                <span className="stat-label">Blockchain Verified</span>
              </div>
            </div>
          </div>

          {paid && (
            <div className="section" style={{ background: '#f0f9ff', border: '1px solid #0ea5e9' }}>
              <h3 style={{ color: '#0369a1' }}>Reference Request Sent!</h3>
              <p>Your reference request has been submitted and payment processed. You'll be notified when the reference is completed.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default References;
