import React, { useState } from 'react';
import { useReferenceStorage } from '../hooks/useIrys';
import { useAccount } from 'wagmi';

const STEPS = {
  WELCOME: 'welcome',
  EMPLOYER_INFO: 'employer_info',
  EMPLOYEE_INFO: 'employee_info',
  PROJECT_INFO: 'project_info',
  REFERENCE_DETAILS: 'reference_details',
  REVIEW: 'review',
  STORING: 'storing',
  COMPLETE: 'complete'
};

function ConversationalInterface({ onComplete, initialData = {} }) {
  const { address } = useAccount();
  const { storeReference, isStoring, storageError, getStorageCost } = useReferenceStorage();
  
  const [currentStep, setCurrentStep] = useState(STEPS.WELCOME);
  const [referenceData, setReferenceData] = useState({
    employerInfo: initialData.employerInfo || {},
    employeeInfo: initialData.employeeInfo || { walletAddress: address },
    projectInfo: initialData.projectInfo || {},
    referenceDetails: initialData.referenceDetails || {},
    metadata: initialData.metadata || { source: 'web_interface' }
  });
  const [storageCost, setStorageCost] = useState(null);
  const [result, setResult] = useState(null);

  const updateData = (section, data) => {
    setReferenceData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const nextStep = () => {
    const stepOrder = Object.values(STEPS);
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const stepOrder = Object.values(STEPS);
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleSubmit = async () => {
    try {
      setCurrentStep(STEPS.STORING);
      const result = await storeReference(referenceData);
      setResult(result);
      setCurrentStep(STEPS.COMPLETE);
      if (onComplete) onComplete(result);
    } catch (error) {
      console.error('Failed to store reference:', error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case STEPS.WELCOME:
        return (
          <div className="step-content">
            <h2>🎉 Create a Verifiable Reference</h2>
            <p>Let's create a permanent, blockchain-verified employment reference that will be stored forever on Irys.</p>
            <div className="features-list">
              <div className="feature">✅ Permanently stored on blockchain</div>
              <div className="feature">🔒 Cryptographically verified</div>
              <div className="feature">🌐 Accessible even if companies close</div>
              <div className="feature">💎 Minted as NFT for portability</div>
            </div>
            <button className="btn btn-primary" onClick={nextStep}>
              Get Started
            </button>
          </div>
        );

      case STEPS.EMPLOYER_INFO:
        return (
          <div className="step-content">
            <h2>👔 Employer Information</h2>
            <p>Please provide details about the person giving this reference.</p>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                value={referenceData.employerInfo.name || ''}
                onChange={(e) => updateData('employerInfo', { name: e.target.value })}
                placeholder="e.g., Sarah Johnson"
              />
            </div>
            <div className="form-group">
              <label>Position/Title *</label>
              <input
                type="text"
                value={referenceData.employerInfo.position || ''}
                onChange={(e) => updateData('employerInfo', { position: e.target.value })}
                placeholder="e.g., Engineering Manager"
              />
            </div>
            <div className="form-group">
              <label>Company *</label>
              <input
                type="text"
                value={referenceData.employerInfo.company || ''}
                onChange={(e) => updateData('employerInfo', { company: e.target.value })}
                placeholder="e.g., TechCorp Inc."
              />
            </div>
            <div className="form-group">
              <label>Wallet Address *</label>
              <input
                type="text"
                value={referenceData.employerInfo.walletAddress || ''}
                onChange={(e) => updateData('employerInfo', { walletAddress: e.target.value })}
                placeholder="0x..."
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={referenceData.employerInfo.email || ''}
                onChange={(e) => updateData('employerInfo', { email: e.target.value })}
                placeholder="sarah@techcorp.com"
              />
            </div>
            <div className="step-actions">
              <button className="btn btn-secondary" onClick={prevStep}>Back</button>
              <button 
                className="btn btn-primary" 
                onClick={nextStep}
                disabled={!referenceData.employerInfo.name || !referenceData.employerInfo.position || !referenceData.employerInfo.company || !referenceData.employerInfo.walletAddress}
              >
                Continue
              </button>
            </div>
          </div>
        );

      case STEPS.EMPLOYEE_INFO:
        return (
          <div className="step-content">
            <h2>👤 Employee Information</h2>
            <p>Information about the person receiving this reference.</p>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                value={referenceData.employeeInfo.name || ''}
                onChange={(e) => updateData('employeeInfo', { name: e.target.value })}
                placeholder="e.g., Alex Smith"
              />
            </div>
            <div className="form-group">
              <label>Wallet Address *</label>
              <input
                type="text"
                value={referenceData.employeeInfo.walletAddress || address || ''}
                onChange={(e) => updateData('employeeInfo', { walletAddress: e.target.value })}
                placeholder="0x..."
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={referenceData.employeeInfo.email || ''}
                onChange={(e) => updateData('employeeInfo', { email: e.target.value })}
                placeholder="alex@example.com"
              />
            </div>
            <div className="step-actions">
              <button className="btn btn-secondary" onClick={prevStep}>Back</button>
              <button 
                className="btn btn-primary" 
                onClick={nextStep}
                disabled={!referenceData.employeeInfo.name || !referenceData.employeeInfo.walletAddress}
              >
                Continue
              </button>
            </div>
          </div>
        );

      case STEPS.PROJECT_INFO:
        return (
          <div className="step-content">
            <h2>🚀 Project Information</h2>
            <p>Details about the work or project this reference covers.</p>
            <div className="form-group">
              <label>Project Title *</label>
              <input
                type="text"
                value={referenceData.projectInfo.title || ''}
                onChange={(e) => updateData('projectInfo', { title: e.target.value })}
                placeholder="e.g., E-commerce Platform Development"
              />
            </div>
            <div className="form-group">
              <label>Role *</label>
              <input
                type="text"
                value={referenceData.projectInfo.role || ''}
                onChange={(e) => updateData('projectInfo', { role: e.target.value })}
                placeholder="e.g., Senior Frontend Developer"
              />
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea
                value={referenceData.projectInfo.description || ''}
                onChange={(e) => updateData('projectInfo', { description: e.target.value })}
                placeholder="Describe the project and the employee's responsibilities..."
                rows={4}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={referenceData.projectInfo.startDate || ''}
                  onChange={(e) => updateData('projectInfo', { startDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={referenceData.projectInfo.endDate || ''}
                  onChange={(e) => updateData('projectInfo', { endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="step-actions">
              <button className="btn btn-secondary" onClick={prevStep}>Back</button>
              <button 
                className="btn btn-primary" 
                onClick={nextStep}
                disabled={!referenceData.projectInfo.title || !referenceData.projectInfo.role || !referenceData.projectInfo.description}
              >
                Continue
              </button>
            </div>
          </div>
        );

      case STEPS.REFERENCE_DETAILS:
        return (
          <div className="step-content">
            <h2>⭐ Reference Details</h2>
            <p>Your assessment and recommendation.</p>
            <div className="form-group">
              <label>Overall Rating *</label>
              <div className="rating-input">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    type="button"
                    className={`rating-star ${referenceData.referenceDetails.rating >= rating ? 'active' : ''}`}
                    onClick={() => updateData('referenceDetails', { rating })}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Would you rehire this person? *</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="wouldRehire"
                    checked={referenceData.referenceDetails.wouldRehire === true}
                    onChange={() => updateData('referenceDetails', { wouldRehire: true })}
                  />
                  Yes, definitely
                </label>
                <label>
                  <input
                    type="radio"
                    name="wouldRehire"
                    checked={referenceData.referenceDetails.wouldRehire === false}
                    onChange={() => updateData('referenceDetails', { wouldRehire: false })}
                  />
                  No
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Recommendation *</label>
              <textarea
                value={referenceData.referenceDetails.recommendation || ''}
                onChange={(e) => updateData('referenceDetails', { recommendation: e.target.value })}
                placeholder="Write your detailed recommendation..."
                rows={6}
              />
            </div>
            <div className="step-actions">
              <button className="btn btn-secondary" onClick={prevStep}>Back</button>
              <button 
                className="btn btn-primary" 
                onClick={nextStep}
                disabled={!referenceData.referenceDetails.rating || referenceData.referenceDetails.wouldRehire === undefined || !referenceData.referenceDetails.recommendation}
              >
                Review & Submit
              </button>
            </div>
          </div>
        );

      case STEPS.REVIEW:
        return (
          <div className="step-content">
            <h2>📋 Review Your Reference</h2>
            <p>Please review all information before submitting to the blockchain.</p>
            
            <div className="review-section">
              <h3>Employer</h3>
              <p><strong>{referenceData.employerInfo.name}</strong> - {referenceData.employerInfo.position}</p>
              <p>{referenceData.employerInfo.company}</p>
            </div>

            <div className="review-section">
              <h3>Employee</h3>
              <p><strong>{referenceData.employeeInfo.name}</strong></p>
            </div>

            <div className="review-section">
              <h3>Project</h3>
              <p><strong>{referenceData.projectInfo.title}</strong></p>
              <p>Role: {referenceData.projectInfo.role}</p>
              <p>{referenceData.projectInfo.description}</p>
            </div>

            <div className="review-section">
              <h3>Reference</h3>
              <p>Rating: {'★'.repeat(referenceData.referenceDetails.rating)}{'☆'.repeat(5-referenceData.referenceDetails.rating)}</p>
              <p>Would rehire: {referenceData.referenceDetails.wouldRehire ? 'Yes' : 'No'}</p>
              <p>{referenceData.referenceDetails.recommendation}</p>
            </div>

            {storageCost && (
              <div className="cost-info">
                <p><strong>Storage Cost:</strong> {storageCost.costEth} ETH</p>
                <p><strong>Data Size:</strong> {storageCost.dataSize} bytes</p>
              </div>
            )}

            <div className="step-actions">
              <button className="btn btn-secondary" onClick={prevStep}>Back</button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                Store on Blockchain
              </button>
            </div>
          </div>
        );

      case STEPS.STORING:
        return (
          <div className="step-content">
            <h2>⏳ Storing Reference...</h2>
            <p>Your reference is being permanently stored on Irys. This may take a moment.</p>
            <div className="loading-spinner"></div>
            {storageError && (
              <div className="error-message">
                <p>Error: {storageError}</p>
                <button className="btn btn-secondary" onClick={() => setCurrentStep(STEPS.REVIEW)}>
                  Try Again
                </button>
              </div>
            )}
          </div>
        );

      case STEPS.COMPLETE:
        return (
          <div className="step-content">
            <h2>🎉 Reference Created Successfully!</h2>
            <p>Your reference has been permanently stored on the blockchain and is now verifiable forever.</p>
            
            {result && (
              <div className="result-info">
                <div className="result-item">
                  <strong>Transaction ID:</strong>
                  <a href={`https://gateway.irys.xyz/${result.transactionId}`} target="_blank" rel="noopener noreferrer">
                    {result.transactionId}
                  </a>
                </div>
                <div className="result-item">
                  <strong>Verification Hash:</strong>
                  <code>{result.verificationHash}</code>
                </div>
                <div className="result-item">
                  <strong>Reference ID:</strong>
                  <code>{result.referenceId}</code>
                </div>
              </div>
            )}

            <div className="next-steps">
              <h3>What's Next?</h3>
              <ul>
                <li>🎨 Your reference will be minted as an NFT</li>
                <li>🔍 Anyone can verify its authenticity</li>
                <li>📱 Share the verification link with potential employers</li>
                <li>💾 The reference is permanently accessible</li>
              </ul>
            </div>

            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Create Another Reference
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="conversational-interface">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${(Object.values(STEPS).indexOf(currentStep) / (Object.values(STEPS).length - 1)) * 100}%` }}
        ></div>
      </div>
      
      <div className="interface-content">
        {renderStep()}
      </div>
    </div>
  );
}

export default ConversationalInterface;
