import React from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { Activity, Users, CheckCircle, Briefcase } from 'lucide-react';

function Dashboard() {
  const stats = [
    { number: '12', label: 'Verified References', icon: CheckCircle, color: 'success' },
    { number: '8', label: 'Active Projects', icon: Briefcase, color: 'primary' },
    { number: '94%', label: 'Profile Completeness', icon: Users, color: 'info' },
    { number: '15', label: 'Network Connections', icon: Activity, color: 'secondary' }
  ];

  const recentActivity = [
    { 
      type: 'reference', 
      message: 'New reference received from Sarah Johnson', 
      time: '2 hours ago',
      status: 'success'
    },
    { 
      type: 'project', 
      message: 'Project "E-commerce Platform" updated', 
      time: '1 day ago',
      status: 'info'
    },
    { 
      type: 'verification', 
      message: 'Skill verification completed for React.js', 
      time: '3 days ago',
      status: 'success'
    },
    { 
      type: 'network', 
      message: 'Connected with former colleague Mike Chen', 
      time: '1 week ago',
      status: 'default'
    }
  ];

  return (
    <div className="dashboard">
      <div className="container">
        <div className="main-content">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard</h1>
          
          <div className="stats-grid">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="stat-card text-center" hover>
                  <div className="flex items-center justify-center mb-3">
                    <IconComponent className="h-8 w-8 text-primary-600" />
                  </div>
                  <span className="stat-number">{stat.number}</span>
                  <span className="stat-label">{stat.label}</span>
                </Card>
              );
            })}
          </div>

          <Card className="section">
            <Card.Header>
              <Card.Title>Recent Activity</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.message}</p>
                      <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                    </div>
                    <Badge variant={activity.status} size="sm">
                      {activity.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          <Card className="section">
            <Card.Header>
              <Card.Title>Quick Actions</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="flex gap-3 flex-wrap">
                <Button>Request Reference</Button>
                <Button variant="secondary">Add New Project</Button>
                <Button variant="outline">Update Profile</Button>
                <Button variant="ghost">Verify Skills</Button>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
