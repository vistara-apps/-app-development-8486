import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';

/**
 * Create a standardized reference data structure
 * @param {Object} referenceData - Raw reference data
 * @returns {Object} Standardized reference structure
 */
export function createReferenceStructure(referenceData) {
  const {
    employerInfo,
    employeeInfo,
    projectInfo,
    referenceDetails,
    metadata = {}
  } = referenceData;

  // Validate required fields
  if (!employerInfo || !employeeInfo || !projectInfo || !referenceDetails) {
    throw new Error('Missing required reference data fields');
  }

  const timestamp = new Date().toISOString();
  const referenceId = uuidv4();

  return {
    id: referenceId,
    version: '1.0.0',
    timestamp,
    type: 'employment_reference',
    
    // Employer information
    employer: {
      name: employerInfo.name,
      position: employerInfo.position,
      company: employerInfo.company,
      email: employerInfo.email,
      walletAddress: employerInfo.walletAddress,
      linkedIn: employerInfo.linkedIn || null,
      verificationMethod: employerInfo.verificationMethod || 'wallet_signature'
    },
    
    // Employee information
    employee: {
      name: employeeInfo.name,
      email: employeeInfo.email,
      walletAddress: employeeInfo.walletAddress,
      linkedIn: employeeInfo.linkedIn || null,
      portfolio: employeeInfo.portfolio || null
    },
    
    // Project/work information
    project: {
      title: projectInfo.title,
      description: projectInfo.description,
      startDate: projectInfo.startDate,
      endDate: projectInfo.endDate,
      role: projectInfo.role,
      technologies: projectInfo.technologies || [],
      achievements: projectInfo.achievements || [],
      deliverables: projectInfo.deliverables || []
    },
    
    // Reference details
    reference: {
      rating: referenceDetails.rating, // 1-5 scale
      strengths: referenceDetails.strengths || [],
      areasForImprovement: referenceDetails.areasForImprovement || [],
      wouldRehire: referenceDetails.wouldRehire,
      recommendation: referenceDetails.recommendation,
      workQuality: referenceDetails.workQuality || null,
      communication: referenceDetails.communication || null,
      reliability: referenceDetails.reliability || null,
      teamwork: referenceDetails.teamwork || null,
      technicalSkills: referenceDetails.technicalSkills || null
    },
    
    // Verification and metadata
    verification: {
      employerSignature: null, // To be filled when signed
      employeeConsent: metadata.employeeConsent || false,
      verificationHash: null, // To be calculated
      blockchainTxHash: null, // To be filled when minted as NFT
      irysTransactionId: null // To be filled when uploaded to Irys
    },
    
    // Additional metadata
    metadata: {
      source: metadata.source || 'web_interface', // web_interface, twitter, email, etc.
      sourceId: metadata.sourceId || null,
      tags: metadata.tags || [],
      isPublic: metadata.isPublic !== false, // Default to public
      allowVerification: metadata.allowVerification !== false, // Default to allow verification
      ...metadata.additional
    }
  };
}

/**
 * Create a verification hash for the reference data
 * @param {Object} referenceData - Reference data structure
 * @returns {string} SHA-256 hash of the reference data
 */
export function createVerificationHash(referenceData) {
  // Create a copy without the verification object to avoid circular references
  const dataForHashing = {
    ...referenceData,
    verification: {
      employeeConsent: referenceData.verification.employeeConsent
    }
  };
  
  const dataString = JSON.stringify(dataForHashing, Object.keys(dataForHashing).sort());
  return CryptoJS.SHA256(dataString).toString();
}

/**
 * Validate reference data structure
 * @param {Object} referenceData - Reference data to validate
 * @returns {Object} Validation result
 */
export function validateReferenceData(referenceData) {
  const errors = [];
  const warnings = [];

  // Check required top-level fields
  const requiredFields = ['id', 'version', 'timestamp', 'type', 'employer', 'employee', 'project', 'reference'];
  requiredFields.forEach(field => {
    if (!referenceData[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Validate employer data
  if (referenceData.employer) {
    const requiredEmployerFields = ['name', 'position', 'company', 'walletAddress'];
    requiredEmployerFields.forEach(field => {
      if (!referenceData.employer[field]) {
        errors.push(`Missing required employer field: ${field}`);
      }
    });

    // Validate wallet address format (basic check)
    if (referenceData.employer.walletAddress && !referenceData.employer.walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      errors.push('Invalid employer wallet address format');
    }
  }

  // Validate employee data
  if (referenceData.employee) {
    const requiredEmployeeFields = ['name', 'walletAddress'];
    requiredEmployeeFields.forEach(field => {
      if (!referenceData.employee[field]) {
        errors.push(`Missing required employee field: ${field}`);
      }
    });

    // Validate wallet address format (basic check)
    if (referenceData.employee.walletAddress && !referenceData.employee.walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      errors.push('Invalid employee wallet address format');
    }
  }

  // Validate project data
  if (referenceData.project) {
    const requiredProjectFields = ['title', 'description', 'role'];
    requiredProjectFields.forEach(field => {
      if (!referenceData.project[field]) {
        errors.push(`Missing required project field: ${field}`);
      }
    });

    // Validate dates
    if (referenceData.project.startDate && referenceData.project.endDate) {
      const startDate = new Date(referenceData.project.startDate);
      const endDate = new Date(referenceData.project.endDate);
      if (startDate > endDate) {
        errors.push('Project start date cannot be after end date');
      }
    }
  }

  // Validate reference data
  if (referenceData.reference) {
    const requiredReferenceFields = ['rating', 'recommendation'];
    requiredReferenceFields.forEach(field => {
      if (referenceData.reference[field] === undefined || referenceData.reference[field] === null) {
        errors.push(`Missing required reference field: ${field}`);
      }
    });

    // Validate rating range
    if (referenceData.reference.rating && (referenceData.reference.rating < 1 || referenceData.reference.rating > 5)) {
      errors.push('Rating must be between 1 and 5');
    }

    // Check for minimum recommendation length
    if (referenceData.reference.recommendation && referenceData.reference.recommendation.length < 10) {
      warnings.push('Recommendation text is very short');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Create a public reference summary (for display without sensitive data)
 * @param {Object} referenceData - Full reference data
 * @returns {Object} Public reference summary
 */
export function createPublicReferenceSummary(referenceData) {
  return {
    id: referenceData.id,
    timestamp: referenceData.timestamp,
    employer: {
      name: referenceData.employer.name,
      position: referenceData.employer.position,
      company: referenceData.employer.company
    },
    employee: {
      name: referenceData.employee.name
    },
    project: {
      title: referenceData.project.title,
      description: referenceData.project.description,
      role: referenceData.project.role,
      technologies: referenceData.project.technologies,
      startDate: referenceData.project.startDate,
      endDate: referenceData.project.endDate
    },
    reference: {
      rating: referenceData.reference.rating,
      strengths: referenceData.reference.strengths,
      recommendation: referenceData.reference.recommendation,
      wouldRehire: referenceData.reference.wouldRehire
    },
    verification: {
      verificationHash: referenceData.verification.verificationHash,
      blockchainTxHash: referenceData.verification.blockchainTxHash,
      irysTransactionId: referenceData.verification.irysTransactionId
    }
  };
}

/**
 * Create NFT metadata structure for reference
 * @param {Object} referenceData - Reference data
 * @param {string} irysTransactionId - Irys transaction ID where full data is stored
 * @returns {Object} NFT metadata structure
 */
export function createNFTMetadata(referenceData, irysTransactionId) {
  return {
    name: `Employment Reference - ${referenceData.employee.name}`,
    description: `Verified employment reference for ${referenceData.employee.name} from ${referenceData.employer.company}`,
    image: `https://api.dicebear.com/7.x/initials/svg?seed=${referenceData.employee.name}`, // Placeholder avatar
    external_url: `https://gateway.irys.xyz/${irysTransactionId}`,
    attributes: [
      {
        trait_type: 'Employee',
        value: referenceData.employee.name
      },
      {
        trait_type: 'Employer',
        value: referenceData.employer.name
      },
      {
        trait_type: 'Company',
        value: referenceData.employer.company
      },
      {
        trait_type: 'Role',
        value: referenceData.project.role
      },
      {
        trait_type: 'Rating',
        value: referenceData.reference.rating,
        max_value: 5
      },
      {
        trait_type: 'Would Rehire',
        value: referenceData.reference.wouldRehire ? 'Yes' : 'No'
      },
      {
        trait_type: 'Reference Date',
        value: referenceData.timestamp
      },
      {
        trait_type: 'Verification Hash',
        value: referenceData.verification.verificationHash
      }
    ],
    properties: {
      irys_transaction_id: irysTransactionId,
      verification_hash: referenceData.verification.verificationHash,
      reference_id: referenceData.id,
      is_verified: true,
      blockchain_verified: true
    }
  };
}

/**
 * Extract search keywords from reference data
 * @param {Object} referenceData - Reference data
 * @returns {Array} Array of search keywords
 */
export function extractSearchKeywords(referenceData) {
  const keywords = new Set();
  
  // Add company and employer info
  if (referenceData.employer.company) {
    keywords.add(referenceData.employer.company.toLowerCase());
  }
  if (referenceData.employer.name) {
    keywords.add(referenceData.employer.name.toLowerCase());
  }
  
  // Add project info
  if (referenceData.project.title) {
    referenceData.project.title.toLowerCase().split(' ').forEach(word => keywords.add(word));
  }
  if (referenceData.project.role) {
    referenceData.project.role.toLowerCase().split(' ').forEach(word => keywords.add(word));
  }
  
  // Add technologies
  if (referenceData.project.technologies) {
    referenceData.project.technologies.forEach(tech => keywords.add(tech.toLowerCase()));
  }
  
  // Add strengths
  if (referenceData.reference.strengths) {
    referenceData.reference.strengths.forEach(strength => {
      strength.toLowerCase().split(' ').forEach(word => keywords.add(word));
    });
  }
  
  // Add metadata tags
  if (referenceData.metadata.tags) {
    referenceData.metadata.tags.forEach(tag => keywords.add(tag.toLowerCase()));
  }
  
  return Array.from(keywords).filter(keyword => keyword.length > 2);
}
