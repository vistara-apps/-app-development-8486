import React from 'react';
import { Shield, Award, Users, Database } from 'lucide-react';
import Card from './ui/Card';

function Features() {
  const features = [
    {
      icon: Shield,
      title: "NFT-Based References",
      description: "Permanent, tamper-proof digital references that stay with you even if your employer goes out of business."
    },
    {
      icon: Award,
      title: "Verified Skill Contributions", 
      description: "Capture and certify your specific project contributions, stored immutably on the blockchain."
    },
    {
      icon: Users,
      title: "Freelancer Work Profiles",
      description: "Comprehensive work history for freelancers, maintained on blockchain and verifiable by clients."
    },
    {
      icon: Database,
      title: "Alumni Network Validation",
      description: "Former colleagues can validate each other's work and contributions on the platform."
    }
  ];

  return (
    <section id="features" className="features">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Choose BlockRef?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Traditional references can disappear when companies close or contacts move on. 
            BlockRef ensures your work history is permanent and verifiable.
          </p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="text-center" hover>
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-cyan-400 rounded-xl flex items-center justify-center mx-auto mb-6 relative">
                  <IconComponent size={24} color="white" />
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-cyan-400 rounded-xl opacity-0 hover:opacity-30 transition-opacity duration-300"></div>
                </div>
                <Card.Title className="mb-4 text-white">{feature.title}</Card.Title>
                <Card.Description className="text-gray-300">{feature.description}</Card.Description>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;
