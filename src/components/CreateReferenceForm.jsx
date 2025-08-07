import React, { useState } from 'react';
import { User, Briefcase, Star, FileText, Mail, Phone, Calendar, DollarSign } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import Modal from './ui/Modal';
import { useToast } from '../hooks/useToast';
import { usePaymentContext } from '../hooks/usePaymentContext';
import { 
  validateForm, 
  validateDateRange, 
  formatFormData, 
  referenceFormValidationSchema 
} from '../utils/validation';

const CreateReferenceForm = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    refereeEmail: '',
    refereeName: '',
    refereePosition: '',
    refereeCompany: '',
    refereePhone: '',
    projectTitle: '',
    projectDescription: '',
    workPeriod: {
      startDate: '',
      endDate: ''
    },
    skills: [],
    expectedRating: 5,
    urgency: 'standard',
    additionalNotes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [skillInput, setSkillInput] = useState('');

  const { success, error: showError } = useToast();
  const { createSession } = usePaymentContext();

  const validateFormStep = (step) => {
    // Get validation errors using the validation utility
    const validationErrors = validateForm(formData, referenceFormValidationSchema);
    
    // Add date range validation
    const dateRangeErrors = validateDateRange(formData);
    const allErrors = { ...validationErrors, ...dateRangeErrors };

    // Filter errors based on current step
    const stepErrors = {};
    
    if (step === 1) {
      const step1Fields = ['refereeName', 'refereeEmail', 'refereePosition', 'refereeCompany', 'refereePhone'];
      step1Fields.forEach(field => {
        if (allErrors[field]) {
          stepErrors[field] = allErrors[field];
        }
      });
    }

    if (step === 2) {
      const step2Fields = ['projectTitle', 'projectDescription', 'workPeriod.startDate', 'workPeriod.endDate', 'skills', 'additionalNotes'];
      step2Fields.forEach(field => {
        if (allErrors[field]) {
          // Handle nested field names
          const errorKey = field.includes('.') ? field.split('.')[1] : field;
          stepErrors[errorKey] = allErrors[field];
        }
      });
      
      // Add date range error if exists
      if (dateRangeErrors.endDate) {
        stepErrors.endDate = dateRangeErrors.endDate;
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
      if (errors.skills) {
        setErrors(prev => ({ ...prev, skills: '' }));
      }
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleNext = () => {
    if (validateFormStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateFormStep(2)) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Format and sanitize form data
      const sanitizedData = formatFormData(formData);
      
      // Process payment first
      await createSession();
      
      // Simulate API call to create reference request
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      success('Reference request created successfully! Payment processed and request sent to referee.');
      
      // Reset form
      setFormData({
        refereeEmail: '',
        refereeName: '',
        refereePosition: '',
        refereeCompany: '',
        refereePhone: '',
        projectTitle: '',
        projectDescription: '',
        workPeriod: { startDate: '', endDate: '' },
        skills: [],
        expectedRating: 5,
        urgency: 'standard',
        additionalNotes: ''
      });
      setCurrentStep(1);
      setErrors({});
      
      onSuccess && onSuccess(sanitizedData);
      onClose();
      
    } catch (error) {
      console.error('Error creating reference:', error);
      showError('Failed to create reference request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <User className="mx-auto h-12 w-12 text-cyan-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900">Referee Information</h3>
        <p className="text-gray-600 mt-2">Tell us about the person who will provide your reference</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Referee Full Name"
          value={formData.refereeName}
          onChange={(e) => handleInputChange('refereeName', e.target.value)}
          error={errors.refereeName}
          required
          placeholder="John Smith"
        />
        
        <Input
          label="Email Address"
          type="email"
          value={formData.refereeEmail}
          onChange={(e) => handleInputChange('refereeEmail', e.target.value)}
          error={errors.refereeEmail}
          required
          placeholder="john.smith@company.com"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Position/Title"
          value={formData.refereePosition}
          onChange={(e) => handleInputChange('refereePosition', e.target.value)}
          error={errors.refereePosition}
          required
          placeholder="Senior Software Engineer"
        />
        
        <Input
          label="Company"
          value={formData.refereeCompany}
          onChange={(e) => handleInputChange('refereeCompany', e.target.value)}
          error={errors.refereeCompany}
          required
          placeholder="Tech Corp Inc."
        />
      </div>

      <Input
        label="Phone Number (Optional)"
        type="tel"
        value={formData.refereePhone}
        onChange={(e) => handleInputChange('refereePhone', e.target.value)}
        placeholder="+1 (555) 123-4567"
      />
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Briefcase className="mx-auto h-12 w-12 text-cyan-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900">Project Details</h3>
        <p className="text-gray-600 mt-2">Provide details about the work you did together</p>
      </div>

      <Input
        label="Project Title"
        value={formData.projectTitle}
        onChange={(e) => handleInputChange('projectTitle', e.target.value)}
        error={errors.projectTitle}
        required
        placeholder="E-commerce Platform Development"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Description <span className="text-red-500">*</span>
        </label>
        <textarea
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          rows={4}
          value={formData.projectDescription}
          onChange={(e) => handleInputChange('projectDescription', e.target.value)}
          placeholder="Describe the project, your role, and key achievements..."
          maxLength={1000}
        />
        <div className="flex justify-between mt-2">
          {errors.projectDescription && (
            <p className="text-sm text-red-600">{errors.projectDescription}</p>
          )}
          <p className="text-sm text-gray-500 ml-auto">
            {formData.projectDescription.length}/1000
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Start Date"
          type="date"
          value={formData.workPeriod.startDate}
          onChange={(e) => handleNestedInputChange('workPeriod', 'startDate', e.target.value)}
          error={errors.startDate}
          required
        />
        
        <Input
          label="End Date"
          type="date"
          value={formData.workPeriod.endDate}
          onChange={(e) => handleNestedInputChange('workPeriod', 'endDate', e.target.value)}
          error={errors.endDate}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skills & Technologies <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            placeholder="Add a skill (e.g., React, Node.js)"
          />
          <Button type="button" onClick={addSkill} size="sm" variant="secondary">
            Add
          </Button>
        </div>
        
        {formData.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-cyan-100 text-cyan-800"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-2 text-cyan-600 hover:text-cyan-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        
        {errors.skills && (
          <p className="text-sm text-red-600">{errors.skills}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expected Rating
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={formData.expectedRating}
            onChange={(e) => handleInputChange('expectedRating', parseInt(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map(rating => (
              <option key={rating} value={rating}>
                {rating} Star{rating !== 1 ? 's' : ''} - {'★'.repeat(rating)}{'☆'.repeat(5-rating)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Urgency
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={formData.urgency}
            onChange={(e) => handleInputChange('urgency', e.target.value)}
          >
            <option value="standard">Standard (7-10 days) - $2</option>
            <option value="priority">Priority (3-5 days) - $5</option>
            <option value="urgent">Urgent (24-48 hours) - $10</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Notes (Optional)
        </label>
        <textarea
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          rows={3}
          value={formData.additionalNotes}
          onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
          placeholder="Any additional context or specific points you'd like the referee to mention..."
          maxLength={500}
        />
        <p className="text-sm text-gray-500 mt-2">
          {formData.additionalNotes.length}/500
        </p>
      </div>
    </div>
  );

  const getPrice = () => {
    const prices = { standard: 2, priority: 5, urgent: 10 };
    return prices[formData.urgency] || 2;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <Modal.Header>
        <Modal.Title>Create Reference Request</Modal.Title>
        <div className="flex items-center mt-2">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 1 ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-cyan-500' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 2 ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
          </div>
          <span className="ml-4 text-sm text-gray-600">
            Step {currentStep} of 2
          </span>
        </div>
      </Modal.Header>

      <Modal.Content>
        <form onSubmit={handleSubmit}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
        </form>
      </Modal.Content>

      <Modal.Footer>
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-4 w-4 mr-1" />
            Price: ${getPrice()}
          </div>
          
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button type="button" variant="ghost" onClick={handleBack}>
                Back
              </Button>
            )}
            
            {currentStep < 2 ? (
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button 
                type="submit" 
                onClick={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : `Create Request ($${getPrice()})`}
              </Button>
            )}
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateReferenceForm;
