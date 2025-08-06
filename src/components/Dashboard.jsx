import React from 'react';

function Dashboard() {
  const stats = [
    { number: '12', label: 'Verified References' },
    { number: '8', label: 'Active Projects' },
    { number: '94%', label: 'Profile Completeness' },
    { number: '15', label: 'Network Connections' }
  ];

  const recentActivity = [
    { type: 'reference', message: 'New reference received from Sarah Johnson', time: '2 hours ago' },
    { type: 'project', message: 'Project "E-commerce Platform" updated', time: '1 day ago' },
    { type: 'verification', message: 'Skill verification completed for React.js', time: '3 days ago' },
    { type: 'network', message: 'Connected with former colleague Mike Chen', time: '1 week ago' }
  ];

  return (
    <div className="dashboard">
      <div className="container">
        <div className="main-content">
          <h1 style={{ marginBottom: '30px', color: '#1a202c' }}>Dashboard</h1>
          
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <span className="stat-number">{stat.number}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="section">
            <h2>Recent Activity</h2>
            <div>
              {recentActivity.map((activity, index) => (
                <div key={index} className="card">
                  <p><strong>{activity.message}</strong></p>
                  <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>{activity.time}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="section">
            <h2>Quick Actions</h2>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <button className="btn">Request Reference</button>
              <button className="btn">Add New Project</button>
              <button className="btn">Update Profile</button>
              <button className="btn">Verify Skills</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;