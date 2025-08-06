import React, { useState } from 'react';

function Profile() {
  const [profile, setProfile] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    linkedin: 'linkedin.com/in/alexjohnson',
    title: 'Senior Full Stack Developer',
    bio: 'Experienced developer with 8+ years in web development, specializing in React, Node.js, and blockchain technologies.'
  });

  const skills = ['React', 'Node.js', 'TypeScript', 'Python', 'Blockchain', 'Smart Contracts', 'AWS', 'Docker'];
  
  const employmentHistory = [
    {
      company: 'TechCorp Inc.',
      position: 'Senior Full Stack Developer',
      startDate: '2022-01',
      endDate: 'Present',
      description: 'Lead development of customer-facing applications and internal tools.'
    },
    {
      company: 'StartupXYZ',
      position: 'Frontend Developer',
      startDate: '2020-06',
      endDate: '2021-12',
      description: 'Built responsive web applications using React and modern frontend technologies.'
    }
  ];

  return (
    <div className="dashboard">
      <div className="container">
        <div className="main-content">
          <h1 style={{ marginBottom: '30px', color: '#1a202c' }}>Profile</h1>
          
          <div className="profile-grid">
            <div className="profile-sidebar">
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{ 
                  width: '120px', 
                  height: '120px', 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '50%',
                  margin: '0 auto 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: 'bold'
                }}>
                  AJ
                </div>
                <h3>{profile.name}</h3>
                <p style={{ color: '#6b7280' }}>{profile.title}</p>
              </div>

              <div className="section">
                <h3>Skills</h3>
                <div style={{ marginTop: '15px' }}>
                  {skills.map((skill, index) => (
                    <span key={index} className="badge">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="section">
                <h3>Contact Information</h3>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Phone:</strong> {profile.phone}</p>
                <p><strong>LinkedIn:</strong> {profile.linkedin}</p>
              </div>
            </div>

            <div className="profile-main">
              <div className="section">
                <h2>About</h2>
                <p>{profile.bio}</p>
                <button className="btn" style={{ marginTop: '15px' }}>Edit Profile</button>
              </div>

              <div className="section">
                <h2>Employment History</h2>
                <div className="project-timeline">
                  {employmentHistory.map((job, index) => (
                    <div key={index} className="timeline-item">
                      <h4>{job.position} at {job.company}</h4>
                      <p style={{ color: '#6b7280', marginBottom: '10px' }}>
                        {job.startDate} - {job.endDate}
                      </p>
                      <p>{job.description}</p>
                    </div>
                  ))}
                </div>
                <button className="btn">Add Employment</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;