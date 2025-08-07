import { useState, useEffect, useCallback } from 'react';
import { useWalletClient } from 'wagmi';
import { irysService } from '../services/irysService.js';

/**
 * React hook for managing Irys operations
 */
export function useIrys() {
  const { data: walletClient, isError, isLoading } = useWalletClient();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(null);

  // Initialize Irys service when wallet is available
  useEffect(() => {
    const initializeService = async () => {
      if (!walletClient || isError || isLoading || isInitialized || isInitializing) {
        return;
      }

      setIsInitializing(true);
      setError(null);

      try {
        await irysService.initialize(walletClient);
        setIsInitialized(true);
        
        // Get initial balance
        const status = await irysService.getServiceStatus();
        if (status.success && status.status.balance) {
          setBalance(status.status.balance);
        }
      } catch (err) {
        console.error('Failed to initialize Irys service:', err);
        setError(err.message);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeService();
  }, [walletClient, isError, isLoading, isInitialized, isInitializing]);

  /**
   * Store a reference on Irys
   */
  const storeReference = useCallback(async (referenceData) => {
    if (!isInitialized) {
      throw new Error('Irys service not initialized');
    }

    try {
      const result = await irysService.storeReference(referenceData);
      
      // Update balance after successful upload
      const status = await irysService.getServiceStatus();
      if (status.success && status.status.balance) {
        setBalance(status.status.balance);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to store reference:', error);
      throw error;
    }
  }, [isInitialized]);

  /**
   * Retrieve a reference from Irys
   */
  const retrieveReference = useCallback(async (transactionId) => {
    try {
      return await irysService.retrieveReference(transactionId);
    } catch (error) {
      console.error('Failed to retrieve reference:', error);
      throw error;
    }
  }, []);

  /**
   * Verify a reference's integrity
   */
  const verifyReference = useCallback(async (transactionId) => {
    try {
      return await irysService.verifyReference(transactionId);
    } catch (error) {
      console.error('Failed to verify reference:', error);
      throw error;
    }
  }, []);

  /**
   * Get storage cost estimate
   */
  const getStorageCost = useCallback(async (referenceData) => {
    if (!isInitialized) {
      throw new Error('Irys service not initialized');
    }

    try {
      return await irysService.getStorageCost(referenceData);
    } catch (error) {
      console.error('Failed to get storage cost:', error);
      throw error;
    }
  }, [isInitialized]);

  /**
   * Fund Irys account
   */
  const fundAccount = useCallback(async (amountEth) => {
    if (!isInitialized) {
      throw new Error('Irys service not initialized');
    }

    try {
      const result = await irysService.fundAccount(amountEth);
      
      // Update balance after funding
      const status = await irysService.getServiceStatus();
      if (status.success && status.status.balance) {
        setBalance(status.status.balance);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to fund account:', error);
      throw error;
    }
  }, [isInitialized]);

  /**
   * Create NFT metadata for a reference
   */
  const createNFTMetadata = useCallback(async (transactionId) => {
    try {
      return await irysService.createNFTMetadataForReference(transactionId);
    } catch (error) {
      console.error('Failed to create NFT metadata:', error);
      throw error;
    }
  }, []);

  /**
   * Refresh balance
   */
  const refreshBalance = useCallback(async () => {
    if (!isInitialized) {
      return;
    }

    try {
      const status = await irysService.getServiceStatus();
      if (status.success && status.status.balance) {
        setBalance(status.status.balance);
      }
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    }
  }, [isInitialized]);

  /**
   * Get service status
   */
  const getServiceStatus = useCallback(async () => {
    try {
      return await irysService.getServiceStatus();
    } catch (error) {
      console.error('Failed to get service status:', error);
      throw error;
    }
  }, []);

  return {
    // State
    isInitialized,
    isInitializing,
    error,
    balance,
    
    // Actions
    storeReference,
    retrieveReference,
    verifyReference,
    getStorageCost,
    fundAccount,
    createNFTMetadata,
    refreshBalance,
    getServiceStatus,
    
    // Computed values
    isReady: isInitialized && !isInitializing && !error,
    hasBalance: balance && parseFloat(balance.eth) > 0
  };
}

/**
 * Hook for managing reference storage operations with loading states
 */
export function useReferenceStorage() {
  const irys = useIrys();
  const [isStoring, setIsStoring] = useState(false);
  const [isRetrieving, setIsRetrieving] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [storageError, setStorageError] = useState(null);

  const storeReferenceWithLoading = useCallback(async (referenceData) => {
    setIsStoring(true);
    setStorageError(null);

    try {
      const result = await irys.storeReference(referenceData);
      return result;
    } catch (error) {
      setStorageError(error.message);
      throw error;
    } finally {
      setIsStoring(false);
    }
  }, [irys]);

  const retrieveReferenceWithLoading = useCallback(async (transactionId) => {
    setIsRetrieving(true);
    setStorageError(null);

    try {
      const result = await irys.retrieveReference(transactionId);
      return result;
    } catch (error) {
      setStorageError(error.message);
      throw error;
    } finally {
      setIsRetrieving(false);
    }
  }, [irys]);

  const verifyReferenceWithLoading = useCallback(async (transactionId) => {
    setIsVerifying(true);
    setStorageError(null);

    try {
      const result = await irys.verifyReference(transactionId);
      return result;
    } catch (error) {
      setStorageError(error.message);
      throw error;
    } finally {
      setIsVerifying(false);
    }
  }, [irys]);

  return {
    ...irys,
    isStoring,
    isRetrieving,
    isVerifying,
    storageError,
    storeReference: storeReferenceWithLoading,
    retrieveReference: retrieveReferenceWithLoading,
    verifyReference: verifyReferenceWithLoading
  };
}
