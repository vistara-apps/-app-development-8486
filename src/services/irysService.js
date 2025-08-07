import { 
  initializeIrys, 
  uploadToIrys, 
  retrieveFromIrys, 
  getUploadCost, 
  checkSufficientBalance,
  fundIrys,
  formatFromAtomic,
  formatToAtomic
} from '../utils/irys.js';
import { 
  createReferenceStructure, 
  createVerificationHash, 
  validateReferenceData,
  createNFTMetadata,
  extractSearchKeywords
} from '../utils/dataStructures.js';

/**
 * Irys Service for handling reference data storage and retrieval
 */
export class IrysService {
  constructor() {
    this.irysClient = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the Irys service with wallet client
   * @param {Object} walletClient - Wagmi wallet client
   */
  async initialize(walletClient) {
    try {
      this.irysClient = await initializeIrys(walletClient);
      this.isInitialized = true;
      console.log('Irys service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Irys service:', error);
      throw error;
    }
  }

  /**
   * Check if service is initialized
   */
  ensureInitialized() {
    if (!this.isInitialized || !this.irysClient) {
      throw new Error('Irys service not initialized. Call initialize() first.');
    }
  }

  /**
   * Store a complete reference on Irys
   * @param {Object} referenceData - Raw reference data
   * @returns {Promise<Object>} Storage result with transaction ID and metadata
   */
  async storeReference(referenceData) {
    this.ensureInitialized();

    try {
      // Create standardized reference structure
      const structuredReference = createReferenceStructure(referenceData);
      
      // Validate the reference data
      const validation = validateReferenceData(structuredReference);
      if (!validation.isValid) {
        throw new Error(`Reference validation failed: ${validation.errors.join(', ')}`);
      }

      // Create verification hash
      const verificationHash = createVerificationHash(structuredReference);
      structuredReference.verification.verificationHash = verificationHash;

      // Extract keywords for searchability
      const keywords = extractSearchKeywords(structuredReference);

      // Prepare tags for Irys upload
      const tags = {
        'Data-Type': 'employment-reference',
        'Reference-ID': structuredReference.id,
        'Employee-Address': structuredReference.employee.walletAddress,
        'Employer-Address': structuredReference.employer.walletAddress,
        'Company': structuredReference.employer.company,
        'Rating': structuredReference.reference.rating.toString(),
        'Verification-Hash': verificationHash,
        'Keywords': keywords.slice(0, 10).join(','), // Limit to 10 keywords
        'Timestamp': structuredReference.timestamp,
        'Version': structuredReference.version
      };

      // Check if we have sufficient balance
      const balanceCheck = await checkSufficientBalance(this.irysClient, structuredReference);
      if (!balanceCheck.hasSufficientBalance) {
        const shortfallEth = formatFromAtomic(balanceCheck.shortfall);
        throw new Error(`Insufficient Irys balance. Need ${shortfallEth} ETH more to upload.`);
      }

      // Upload to Irys
      const uploadResult = await uploadToIrys(this.irysClient, structuredReference, tags);
      
      // Update the reference with Irys transaction ID
      structuredReference.verification.irysTransactionId = uploadResult.id;

      console.log('Reference stored successfully on Irys:', uploadResult.id);

      return {
        success: true,
        transactionId: uploadResult.id,
        verificationHash,
        referenceId: structuredReference.id,
        uploadCost: balanceCheck.cost,
        timestamp: uploadResult.timestamp,
        reference: structuredReference,
        validation
      };

    } catch (error) {
      console.error('Failed to store reference on Irys:', error);
      throw new Error(`Reference storage failed: ${error.message}`);
    }
  }

  /**
   * Retrieve a reference from Irys
   * @param {string} transactionId - Irys transaction ID
   * @returns {Promise<Object>} Retrieved reference data
   */
  async retrieveReference(transactionId) {
    try {
      const referenceData = await retrieveFromIrys(transactionId);
      
      // Validate the retrieved data
      const validation = validateReferenceData(referenceData);
      
      return {
        success: true,
        reference: referenceData,
        isValid: validation.isValid,
        validation
      };
    } catch (error) {
      console.error('Failed to retrieve reference from Irys:', error);
      throw new Error(`Reference retrieval failed: ${error.message}`);
    }
  }

  /**
   * Verify a reference's integrity
   * @param {string} transactionId - Irys transaction ID
   * @returns {Promise<Object>} Verification result
   */
  async verifyReference(transactionId) {
    try {
      const retrievalResult = await this.retrieveReference(transactionId);
      const referenceData = retrievalResult.reference;

      // Recalculate verification hash
      const calculatedHash = createVerificationHash(referenceData);
      const storedHash = referenceData.verification.verificationHash;

      const isIntegrityValid = calculatedHash === storedHash;

      return {
        success: true,
        transactionId,
        referenceId: referenceData.id,
        isIntegrityValid,
        calculatedHash,
        storedHash,
        timestamp: referenceData.timestamp,
        employer: referenceData.employer.company,
        employee: referenceData.employee.name,
        validation: retrievalResult.validation
      };
    } catch (error) {
      console.error('Failed to verify reference:', error);
      throw new Error(`Reference verification failed: ${error.message}`);
    }
  }

  /**
   * Get storage cost estimate for reference data
   * @param {Object} referenceData - Reference data to estimate cost for
   * @returns {Promise<Object>} Cost estimation
   */
  async getStorageCost(referenceData) {
    this.ensureInitialized();

    try {
      const structuredReference = createReferenceStructure(referenceData);
      const cost = await getUploadCost(this.irysClient, structuredReference);
      const costEth = formatFromAtomic(cost);

      return {
        success: true,
        costAtomic: cost,
        costEth,
        dataSize: JSON.stringify(structuredReference).length
      };
    } catch (error) {
      console.error('Failed to get storage cost:', error);
      throw new Error(`Cost estimation failed: ${error.message}`);
    }
  }

  /**
   * Fund Irys account
   * @param {string} amountEth - Amount in ETH to fund
   * @returns {Promise<Object>} Funding result
   */
  async fundAccount(amountEth) {
    this.ensureInitialized();

    try {
      const amountAtomic = formatToAtomic(amountEth);
      const fundResult = await fundIrys(this.irysClient, amountAtomic);

      return {
        success: true,
        transactionHash: fundResult.id,
        amount: amountEth,
        amountAtomic
      };
    } catch (error) {
      console.error('Failed to fund Irys account:', error);
      throw new Error(`Funding failed: ${error.message}`);
    }
  }

  /**
   * Create NFT metadata for a stored reference
   * @param {string} transactionId - Irys transaction ID
   * @returns {Promise<Object>} NFT metadata
   */
  async createNFTMetadataForReference(transactionId) {
    try {
      const retrievalResult = await this.retrieveReference(transactionId);
      const referenceData = retrievalResult.reference;

      const nftMetadata = createNFTMetadata(referenceData, transactionId);

      return {
        success: true,
        metadata: nftMetadata,
        referenceId: referenceData.id
      };
    } catch (error) {
      console.error('Failed to create NFT metadata:', error);
      throw new Error(`NFT metadata creation failed: ${error.message}`);
    }
  }

  /**
   * Batch store multiple references
   * @param {Array} referencesData - Array of reference data objects
   * @returns {Promise<Array>} Array of storage results
   */
  async batchStoreReferences(referencesData) {
    this.ensureInitialized();

    const results = [];
    
    for (const referenceData of referencesData) {
      try {
        const result = await this.storeReference(referenceData);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          error: error.message,
          referenceData
        });
      }
    }

    return results;
  }

  /**
   * Search references by employer address
   * @param {string} employerAddress - Employer wallet address
   * @returns {Promise<Array>} Array of reference transaction IDs
   */
  async searchReferencesByEmployer(employerAddress) {
    // Note: This is a simplified search. In a production environment,
    // you would use Irys GraphQL API or maintain a separate index
    try {
      // This would require implementing a proper search mechanism
      // For now, we'll return a placeholder
      console.warn('Reference search not fully implemented. Use Irys GraphQL API for production.');
      
      return {
        success: true,
        references: [],
        message: 'Search functionality requires Irys GraphQL API integration'
      };
    } catch (error) {
      console.error('Failed to search references:', error);
      throw new Error(`Reference search failed: ${error.message}`);
    }
  }

  /**
   * Get service status and statistics
   * @returns {Promise<Object>} Service status
   */
  async getServiceStatus() {
    try {
      const status = {
        isInitialized: this.isInitialized,
        hasClient: !!this.irysClient
      };

      if (this.isInitialized && this.irysClient) {
        // Get balance and other stats
        const balance = await this.irysClient.getBalance(this.irysClient.address);
        status.balance = {
          atomic: balance.toString(),
          eth: formatFromAtomic(balance.toString())
        };
        status.address = this.irysClient.address;
      }

      return {
        success: true,
        status
      };
    } catch (error) {
      console.error('Failed to get service status:', error);
      return {
        success: false,
        error: error.message,
        status: {
          isInitialized: this.isInitialized,
          hasClient: !!this.irysClient
        }
      };
    }
  }
}

// Export singleton instance
export const irysService = new IrysService();
