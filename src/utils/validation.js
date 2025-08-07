/**
 * Validation utilities for form inputs
 */

export const validators = {
  required: (value, fieldName = 'Field') => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName} is required`;
    }
    return null;
  },

  email: (value) => {
    if (!value) return null; // Let required validator handle empty values
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },

  minLength: (value, minLength, fieldName = 'Field') => {
    if (!value) return null; // Let required validator handle empty values
    if (value.length < minLength) {
      return `${fieldName} must be at least ${minLength} characters long`;
    }
    return null;
  },

  maxLength: (value, maxLength, fieldName = 'Field') => {
    if (!value) return null;
    if (value.length > maxLength) {
      return `${fieldName} must be no more than ${maxLength} characters long`;
    }
    return null;
  },

  phone: (value) => {
    if (!value) return null; // Phone is optional
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
      return 'Please enter a valid phone number';
    }
    return null;
  },

  dateRange: (startDate, endDate) => {
    if (!startDate || !endDate) return null;
    if (new Date(startDate) >= new Date(endDate)) {
      return 'End date must be after start date';
    }
    return null;
  },

  pastDate: (date, fieldName = 'Date') => {
    if (!date) return null;
    if (new Date(date) > new Date()) {
      return `${fieldName} cannot be in the future`;
    }
    return null;
  },

  arrayMinLength: (array, minLength, fieldName = 'Field') => {
    if (!Array.isArray(array) || array.length < minLength) {
      return `Please add at least ${minLength} ${fieldName.toLowerCase()}${minLength > 1 ? 's' : ''}`;
    }
    return null;
  }
};

/**
 * Validate a single field with multiple validators
 * @param {any} value - The value to validate
 * @param {Array} validationRules - Array of validation rule objects
 * @returns {string|null} - Error message or null if valid
 */
export const validateField = (value, validationRules = []) => {
  for (const rule of validationRules) {
    const error = rule.validator(value, ...rule.params);
    if (error) {
      return error;
    }
  }
  return null;
};

/**
 * Validate an entire form object
 * @param {Object} formData - The form data object
 * @param {Object} validationSchema - Schema defining validation rules for each field
 * @returns {Object} - Object containing errors for each field
 */
export const validateForm = (formData, validationSchema) => {
  const errors = {};

  Object.keys(validationSchema).forEach(fieldName => {
    const fieldRules = validationSchema[fieldName];
    const fieldValue = getNestedValue(formData, fieldName);
    const error = validateField(fieldValue, fieldRules);
    
    if (error) {
      errors[fieldName] = error;
    }
  });

  return errors;
};

/**
 * Get nested value from object using dot notation
 * @param {Object} obj - The object to get value from
 * @param {string} path - Dot notation path (e.g., 'user.profile.name')
 * @returns {any} - The nested value
 */
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
};

/**
 * Reference form validation schema
 */
export const referenceFormValidationSchema = {
  refereeName: [
    { validator: validators.required, params: ['Referee name'] },
    { validator: validators.minLength, params: [2, 'Referee name'] },
    { validator: validators.maxLength, params: [100, 'Referee name'] }
  ],
  refereeEmail: [
    { validator: validators.required, params: ['Email address'] },
    { validator: validators.email, params: [] }
  ],
  refereePosition: [
    { validator: validators.required, params: ['Position'] },
    { validator: validators.minLength, params: [2, 'Position'] },
    { validator: validators.maxLength, params: [100, 'Position'] }
  ],
  refereeCompany: [
    { validator: validators.required, params: ['Company name'] },
    { validator: validators.minLength, params: [2, 'Company name'] },
    { validator: validators.maxLength, params: [100, 'Company name'] }
  ],
  refereePhone: [
    { validator: validators.phone, params: [] }
  ],
  projectTitle: [
    { validator: validators.required, params: ['Project title'] },
    { validator: validators.minLength, params: [5, 'Project title'] },
    { validator: validators.maxLength, params: [200, 'Project title'] }
  ],
  projectDescription: [
    { validator: validators.required, params: ['Project description'] },
    { validator: validators.minLength, params: [50, 'Project description'] },
    { validator: validators.maxLength, params: [1000, 'Project description'] }
  ],
  'workPeriod.startDate': [
    { validator: validators.required, params: ['Start date'] },
    { validator: validators.pastDate, params: ['Start date'] }
  ],
  'workPeriod.endDate': [
    { validator: validators.required, params: ['End date'] },
    { validator: validators.pastDate, params: ['End date'] }
  ],
  skills: [
    { validator: validators.arrayMinLength, params: [1, 'skill'] }
  ],
  additionalNotes: [
    { validator: validators.maxLength, params: [500, 'Additional notes'] }
  ]
};

/**
 * Custom validation for date range
 * @param {Object} formData - Form data containing workPeriod
 * @returns {Object} - Errors object
 */
export const validateDateRange = (formData) => {
  const errors = {};
  const { startDate, endDate } = formData.workPeriod || {};
  
  const dateRangeError = validators.dateRange(startDate, endDate);
  if (dateRangeError) {
    errors.endDate = dateRangeError;
  }
  
  return errors;
};

/**
 * Sanitize input to prevent XSS
 * @param {string} input - Input string to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Format form data for submission
 * @param {Object} formData - Raw form data
 * @returns {Object} - Formatted and sanitized form data
 */
export const formatFormData = (formData) => {
  const formatted = { ...formData };
  
  // Sanitize string fields
  const stringFields = [
    'refereeName', 'refereeEmail', 'refereePosition', 'refereeCompany',
    'refereePhone', 'projectTitle', 'projectDescription', 'additionalNotes'
  ];
  
  stringFields.forEach(field => {
    if (formatted[field]) {
      formatted[field] = sanitizeInput(formatted[field].trim());
    }
  });
  
  // Sanitize skills array
  if (formatted.skills) {
    formatted.skills = formatted.skills.map(skill => sanitizeInput(skill.trim()));
  }
  
  return formatted;
};
