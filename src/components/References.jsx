import React, { useState } from 'react';
import { Plus, Shield, Clock, Star, Calendar } from 'lucide-react';
import CreateReferenceForm from './CreateReferenceForm';
import Button from './ui/Button';
import { useToast } from '../hooks/useToast';

function References() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [references, setReferences] = useState([
    {
      id: 1,
      from: 'Sarah Johnson',
      position: 'Engineering Manager at TechCorp',
      project: 'E-commerce Platform Redesign',
      rating: 5,
      description: 'Alex delivered exceptional work on our platform redesign. Their technical skills and attention to detail were outstanding.',
      status: 'verified',
      date: '2023-11-15',
      skills: ['React', 'Node.js', 'PostgreSQL', 'AWS']
    },
    {
      id: 2,
      from: 'Mike Chen',
      position: 'CTO at StartupXYZ',
      project: 'Mobile App Development',
      rating: 5,
      description: 'Excellent developer with strong problem-solving skills. Always delivered high-quality code on time.',
      status: 'verified',
      date: '2023-10-20',
      skills: ['React Native', 'TypeScript', 'Firebase']
    },
    {
      id: 3,
      from: 'Jennifer Brown',
      position: 'Product Manager at InnovateLab',
      project: 'Analytics Dashboard',
      rating: 4,
      description: 'Great collaboration and technical execution. Alex understood our requirements perfectly.',
      status: 'pending',
      date: '2023-12-01',
      skills: ['Vue.js', 'Python', 'MongoDB']
    }
  ]);

  const { success } = useToast();

  const handleCreateSuccess = (newReference) => {
    // Add the new reference to the list with a pending status
    const newRef = {
      id: Date.now(),
      from: newReference.refereeName,
      position: `${newReference.refereePosition} at ${newReference.refereeCompany}`,
      project: newReference.projectTitle,
      rating: newReference.expectedRating,
      description: newReference.projectDescription,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      skills: newReference.skills,
      urgency: newReference.urgency
    };
    
    setReferences(prev => [newRef, ...prev]);
    success('Reference request created successfully!');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <Shield className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">References</h1>
            <p className="text-gray-600 mt-2">Manage your blockchain-verified professional references</p>
          </div>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Reference Request
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total References</p>
                <p className="text-2xl font-bold text-gray-900">{references.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-green-600">{references.filter(r => r.status === 'verified').length}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {references.length > 0 ? (references.reduce((sum, r) => sum + r.rating, 0) / references.length).toFixed(1) : '0.0'}
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Blockchain Verified</p>
                <p className="text-2xl font-bold text-purple-600">100%</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* References List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your References</h2>
            <p className="text-gray-600 mt-1">All your professional references in one place</p>
          </div>

          <div className="divide-y divide-gray-200">
            {references.length === 0 ? (
              <div className="p-12 text-center">
                <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No references yet</h3>
                <p className="text-gray-600 mb-6">Start building your professional reputation by requesting your first reference.</p>
                <Button onClick={() => setShowCreateForm(true)}>
                  Create Your First Reference
                </Button>
              </div>
            ) : (
              references.map((reference) => (
                <div key={reference.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{reference.from}</h3>
                          <p className="text-gray-600">{reference.position}</p>
                        </div>
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(reference.status)}`}>
                          {getStatusIcon(reference.status)}
                          {reference.status.charAt(0).toUpperCase() + reference.status.slice(1)}
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="font-medium text-gray-900 mb-1">Project: {reference.project}</p>
                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-sm text-gray-600">Rating:</span>
                          <div className="flex items-center">
                            {'★'.repeat(reference.rating)}
                            {'☆'.repeat(5 - reference.rating)}
                            <span className="ml-2 text-sm text-gray-600">({reference.rating}/5)</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4">{reference.description}</p>

                      {reference.skills && reference.skills.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-900 mb-2">Skills & Technologies:</p>
                          <div className="flex flex-wrap gap-2">
                            {reference.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Received: {new Date(reference.date).toLocaleDateString()}
                        </div>
                        {reference.urgency && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {reference.urgency.charAt(0).toUpperCase() + reference.urgency.slice(1)} Priority
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Create Reference Form Modal */}
        <CreateReferenceForm
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          onSuccess={handleCreateSuccess}
        />
      </div>
    </div>
  );
}

export default References;
