import React from 'react';
import { Shield, Award, Users, Database } from 'lucide-react';

function Features() {
  const features = [
    {
      icon: <Shield size={24} color="white" />,
      title: "NFT-Based References",
      description: "Permanent, tamper-proof digital references that stay with you even if your employer goes out of business."
    },
    {
      icon: <Award size={24} color="white" />,
      title: "Verified Skill Contributions", 
      description: "Capture and certify your specific project contributions, stored immutably on the blockchain."
    },
    {
      icon: <Users size={24} color="white" />,
      title: "Freelancer Work Profiles",
      description: "Comprehensive work history for freelancers, maintained on blockchain and verifiable by clients."
    },
    {
      icon: <Database size={24} color="white" />,
      title: "Alumni Network Validation",
      description: "Former colleagues can validate each other's work and contributions on the platform."
    }
  ];

  return (
    <section id="features" className="features">
      <div className="container">
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '20px' }}>
          Why Choose BlockRef?
        </h2>
        <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#4a5568', maxWidth: '600px', margin: '0 auto' }}>
          Traditional references can disappear when companies close or contacts move on. 
          BlockRef ensures your work history is permanent and verifiable.
        </p>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;