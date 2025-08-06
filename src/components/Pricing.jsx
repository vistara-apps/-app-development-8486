import React from 'react';
import { usePaymentContext } from '../hooks/usePaymentContext';

function Pricing() {
  const { createSession } = usePaymentContext();

  const plans = [
    {
      name: 'Individual',
      price: '$9',
      period: '/month',
      description: 'Perfect for professionals and freelancers',
      features: [
        'Up to 10 verified references',
        'Basic profile customization',
        '5 project entries',
        'Standard support',
        'Basic analytics'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '$29',
      period: '/month',
      description: 'Ideal for experienced professionals',
      features: [
        'Unlimited verified references',
        'Advanced profile customization',
        'Unlimited project entries',
        'Priority support',
        'Advanced analytics',
        'LinkedIn integration',
        'Custom reference templates'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: '/month',
      description: 'For organizations and teams',
      features: [
        'Everything in Professional',
        'Team management tools',
        'Bulk reference processing',
        'API access',
        'Custom branding',
        'Dedicated account manager',
        'Advanced security features'
      ],
      popular: false
    }
  ];

  const handleSubscribe = async (planName, price) => {
    try {
      await createSession();
      alert(`Successfully subscribed to ${planName} plan for ${price}/month!`);
    } catch (error) {
      alert('Payment failed. Please try again.');
      console.error('Payment error:', error);
    }
  };

  return (
    <section className="pricing">
      <div className="container">
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '20px' }}>
          Choose Your Plan
        </h2>
        <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#4a5568', maxWidth: '600px', margin: '0 auto' }}>
          Select the perfect plan for your professional needs. All plans include blockchain verification and permanent storage.
        </p>
        
        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <div key={index} className={`pricing-card ${plan.popular ? 'featured' : ''}`}>
              <h3>{plan.name}</h3>
              <div className="price">
                {plan.price}<span>{plan.period}</span>
              </div>
              <p style={{ marginBottom: '30px', color: '#6b7280' }}>{plan.description}</p>
              
              <ul className="pricing-features">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex}>✓ {feature}</li>
                ))}
              </ul>
              
              <button 
                className="btn"
                onClick={() => handleSubscribe(plan.name, plan.price)}
                style={{ width: '100%' }}
              >
                {plan.popular ? 'Start Free Trial' : 'Choose Plan'}
              </button>
            </div>
          ))}
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <p style={{ color: '#6b7280', marginBottom: '20px' }}>
            All plans include 30-day money-back guarantee
          </p>
          <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
            Questions? Contact our sales team for custom enterprise solutions.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Pricing;