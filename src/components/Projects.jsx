import React, { useState } from 'react';

function Projects() {
  const [projects] = useState([
    {
      id: 1,
      name: 'E-commerce Platform Redesign',
      description: 'Complete overhaul of the company\'s e-commerce platform using React and Node.js',
      startDate: '2023-06-01',
      endDate: '2023-11-30',
      status: 'completed',
      contributions: [
        'Architected the frontend application structure',
        'Implemented responsive design across all components',
        'Optimized performance resulting in 40% faster load times',
        'Integrated payment gateway and checkout flow'
      ],
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API'],
      team: ['Sarah Johnson', 'Mike Peters', 'Lisa Wang']
    },
    {
      id: 2,
      name: 'Mobile App Development',
      description: 'Cross-platform mobile application for task management',
      startDate: '2023-01-15',
      endDate: '2023-05-20',
      status: 'completed',
      contributions: [
        'Built the entire frontend using React Native',
        'Implemented real-time synchronization',
        'Created user authentication system',
        'Deployed to both iOS and Android app stores'
      ],
      technologies: ['React Native', 'Firebase', 'Redux'],
      team: ['Mike Chen', 'Amanda Rodriguez']
    },
    {
      id: 3,
      name: 'Analytics Dashboard',
      description: 'Real-time analytics dashboard for business intelligence',
      startDate: '2023-12-01',
      endDate: '2024-02-28',
      status: 'in-progress',
      contributions: [
        'Designing data visualization components',
        'Building RESTful API endpoints',
        'Implementing caching strategies'
      ],
      technologies: ['Vue.js', 'Python', 'PostgreSQL', 'D3.js'],
      team: ['Jennifer Brown', 'David Kim']
    }
  ]);

  return (
    <div className="dashboard">
      <div className="container">
        <div className="main-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1 style={{ color: '#1a202c' }}>Projects</h1>
            <button className="btn">Add New Project</button>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-number">{projects.length}</span>
              <span className="stat-label">Total Projects</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{projects.filter(p => p.status === 'completed').length}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{projects.filter(p => p.status === 'in-progress').length}</span>
              <span className="stat-label">In Progress</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">85%</span>
              <span className="stat-label">Success Rate</span>
            </div>
          </div>

          {projects.map((project) => (
            <div key={project.id} className="section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>{project.name}</h2>
                <span className={`badge ${project.status === 'completed' ? 'status-verified' : 'status-pending'}`}>
                  {project.status}
                </span>
              </div>
              
              <p style={{ marginBottom: '20px', color: '#4a5568' }}>{project.description}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                <div>
                  <h4>Project Timeline</h4>
                  <p><strong>Start:</strong> {project.startDate}</p>
                  <p><strong>End:</strong> {project.endDate}</p>
                  
                  <h4 style={{ marginTop: '20px' }}>Technologies</h4>
                  <div style={{ marginTop: '10px' }}>
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="badge">{tech}</span>
                    ))}
                  </div>
                  
                  <h4 style={{ marginTop: '20px' }}>Team Members</h4>
                  <ul style={{ marginTop: '10px', listStyle: 'none' }}>
                    {project.team.map((member, index) => (
                      <li key={index} style={{ padding: '5px 0' }}>{member}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4>My Contributions</h4>
                  <ul style={{ marginTop: '10px', listStyle: 'disc', paddingLeft: '20px' }}>
                    {project.contributions.map((contribution, index) => (
                      <li key={index} style={{ padding: '5px 0', color: '#4a5568' }}>
                        {contribution}
                      </li>
                    ))}
                  </ul>
                  
                  <div style={{ marginTop: '20px' }}>
                    <button className="btn" style={{ marginRight: '10px' }}>
                      Request Reference
                    </button>
                    <button className="btn btn-secondary">
                      Edit Project
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Projects;