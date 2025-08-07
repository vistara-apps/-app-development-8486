/**
 * Error handling utilities for the application
 */

/**
 * Custom error classes for better error categorization
 */
export class IrysError extends Error {
  constructor(message, code = 'IRYS_ERROR', details = null) {
    super(message);
    this.name = 'IrysError';
    this.code = code;
    this.details = details;
  }
}

export class ValidationError extends Error {
  constructor(message, field = null, value = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
  }
}

export class WalletError extends Error {
  constructor(message, code = 'WALLET_ERROR') {
    super(message);
    this.name = 'WalletError';
    this.code = code;
  }
}

/**
 * Error codes for different types of failures
 */
export const ERROR_CODES = {
  // Irys related errors
  IRYS_INIT_FAILED: 'IRYS_INIT_FAILED',
  IRYS_UPLOAD_FAILED: 'IRYS_UPLOAD_FAILED',
  IRYS_RETRIEVE_FAILED: 'IRYS_RETRIEVE_FAILED',
  IRYS_INSUFFICIENT_BALANCE: 'IRYS_INSUFFICIENT_BALANCE',
  IRYS_FUNDING_FAILED: 'IRYS_FUNDING_FAILED',
  
  // Validation errors
  VALIDATION_REQUIRED_FIELD: 'VALIDATION_REQUIRED_FIELD',
  VALIDATION_INVALID_FORMAT: 'VALIDATION_INVALID_FORMAT',
  VALIDATION_INVALID_ADDRESS: 'VALIDATION_INVALID_ADDRESS',
  
  // Wallet errors
  WALLET_NOT_CONNECTED: 'WALLET_NOT_CONNECTED',
  WALLET_NETWORK_MISMATCH: 'WALLET_NETWORK_MISMATCH',
  WALLET_TRANSACTION_REJECTED: 'WALLET_TRANSACTION_REJECTED',
  
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  
  // General errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

/**
 * User-friendly error messages
 */
export const ERROR_MESSAGES = {
  [ERROR_CODES.IRYS_INIT_FAILED]: 'Failed to connect to Irys network. Please check your wallet connection.',
  [ERROR_CODES.IRYS_UPLOAD_FAILED]: 'Failed to upload reference to blockchain. Please try again.',
  [ERROR_CODES.IRYS_RETRIEVE_FAILED]: 'Failed to retrieve reference from blockchain.',
  [ERROR_CODES.IRYS_INSUFFICIENT_BALANCE]: 'Insufficient balance to store reference. Please fund your account.',
  [ERROR_CODES.IRYS_FUNDING_FAILED]: 'Failed to fund Irys account. Please try again.',
  
  [ERROR_CODES.VALIDATION_REQUIRED_FIELD]: 'Please fill in all required fields.',
  [ERROR_CODES.VALIDATION_INVALID_FORMAT]: 'Invalid format provided.',
  [ERROR_CODES.VALIDATION_INVALID_ADDRESS]: 'Invalid wallet address format.',
  
  [ERROR_CODES.WALLET_NOT_CONNECTED]: 'Please connect your wallet to continue.',
  [ERROR_CODES.WALLET_NETWORK_MISMATCH]: 'Please switch to the correct network.',
  [ERROR_CODES.WALLET_TRANSACTION_REJECTED]: 'Transaction was rejected. Please try again.',
  
  [ERROR_CODES.NETWORK_ERROR]: 'Network error occurred. Please check your connection.',
  [ERROR_CODES.TIMEOUT_ERROR]: 'Request timed out. Please try again.',
  
  [ERROR_CODES.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.'
};

/**
 * Parse and categorize errors
 * @param {Error} error - The error to parse
 * @returns {Object} Parsed error with user-friendly message
 */
export function parseError(error) {
  // If it's already one of our custom errors, return as is
  if (error instanceof IrysError || error instanceof ValidationError || error instanceof WalletError) {
    return {
      type: error.name,
      code: error.code || ERROR_CODES.UNKNOWN_ERROR,
      message: error.message,
      userMessage: ERROR_MESSAGES[error.code] || error.message,
      details: error.details || null
    };
  }

  // Parse common error patterns
  const errorMessage = error.message?.toLowerCase() || '';
  
  // Irys specific errors
  if (errorMessage.includes('irys') || errorMessage.includes('arweave')) {
    if (errorMessage.includes('insufficient')) {
      return {
        type: 'IrysError',
        code: ERROR_CODES.IRYS_INSUFFICIENT_BALANCE,
        message: error.message,
        userMessage: ERROR_MESSAGES[ERROR_CODES.IRYS_INSUFFICIENT_BALANCE]
      };
    }
    if (errorMessage.includes('upload') || errorMessage.includes('store')) {
      return {
        type: 'IrysError',
        code: ERROR_CODES.IRYS_UPLOAD_FAILED,
        message: error.message,
        userMessage: ERROR_MESSAGES[ERROR_CODES.IRYS_UPLOAD_FAILED]
      };
    }
    return {
      type: 'IrysError',
      code: ERROR_CODES.IRYS_INIT_FAILED,
      message: error.message,
      userMessage: ERROR_MESSAGES[ERROR_CODES.IRYS_INIT_FAILED]
    };
  }

  // Wallet specific errors
  if (errorMessage.includes('wallet') || errorMessage.includes('metamask')) {
    if (errorMessage.includes('rejected') || errorMessage.includes('denied')) {
      return {
        type: 'WalletError',
        code: ERROR_CODES.WALLET_TRANSACTION_REJECTED,
        message: error.message,
        userMessage: ERROR_MESSAGES[ERROR_CODES.WALLET_TRANSACTION_REJECTED]
      };
    }
    if (errorMessage.includes('network') || errorMessage.includes('chain')) {
      return {
        type: 'WalletError',
        code: ERROR_CODES.WALLET_NETWORK_MISMATCH,
        message: error.message,
        userMessage: ERROR_MESSAGES[ERROR_CODES.WALLET_NETWORK_MISMATCH]
      };
    }
    return {
      type: 'WalletError',
      code: ERROR_CODES.WALLET_NOT_CONNECTED,
      message: error.message,
      userMessage: ERROR_MESSAGES[ERROR_CODES.WALLET_NOT_CONNECTED]
    };
  }

  // Network errors
  if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('timeout')) {
    const code = errorMessage.includes('timeout') ? ERROR_CODES.TIMEOUT_ERROR : ERROR_CODES.NETWORK_ERROR;
    return {
      type: 'NetworkError',
      code,
      message: error.message,
      userMessage: ERROR_MESSAGES[code]
    };
  }

  // Default unknown error
  return {
    type: 'UnknownError',
    code: ERROR_CODES.UNKNOWN_ERROR,
    message: error.message,
    userMessage: ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR]
  };
}

/**
 * Create a user-friendly error message
 * @param {Error} error - The error to format
 * @returns {string} User-friendly error message
 */
export function formatErrorMessage(error) {
  const parsed = parseError(error);
  return parsed.userMessage;
}

/**
 * Log error with context
 * @param {Error} error - The error to log
 * @param {string} context - Context where the error occurred
 * @param {Object} additionalData - Additional data to log
 */
export function logError(error, context = 'Unknown', additionalData = {}) {
  const parsed = parseError(error);
  console.error(`[${context}] ${parsed.type}:`, {
    code: parsed.code,
    message: parsed.message,
    userMessage: parsed.userMessage,
    details: parsed.details,
    additionalData,
    stack: error.stack
  });
}

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} Result of the function
 */
export async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Exponential backoff: baseDelay * 2^attempt
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}
