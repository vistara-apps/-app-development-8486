import Irys from '@irys/sdk';

// Irys configuration
const IRYS_NODE_URL = 'https://node2.irys.xyz';
const IRYS_TOKEN = 'ethereum'; // Using Ethereum for payments

/**
 * Initialize Irys client with wallet
 * @param {Object} walletClient - Wagmi wallet client
 * @returns {Promise<Irys>} Initialized Irys client
 */
export async function initializeIrys(walletClient) {
  if (!walletClient || !walletClient.account) {
    throw new Error('Wallet client is required to initialize Irys');
  }

  try {
    const irys = new Irys({
      url: IRYS_NODE_URL,
      token: IRYS_TOKEN,
      wallet: {
        provider: walletClient,
        name: 'ethereum'
      }
    });

    // Check if Irys is ready
    await irys.ready();
    return irys;
  } catch (error) {
    console.error('Failed to initialize Irys:', error);
    throw new Error(`Irys initialization failed: ${error.message}`);
  }
}

/**
 * Get Irys balance for the connected wallet
 * @param {Irys} irys - Initialized Irys client
 * @returns {Promise<string>} Balance in atomic units
 */
export async function getIrysBalance(irys) {
  try {
    const balance = await irys.getBalance(irys.address);
    return balance.toString();
  } catch (error) {
    console.error('Failed to get Irys balance:', error);
    throw new Error(`Failed to get balance: ${error.message}`);
  }
}

/**
 * Fund Irys account
 * @param {Irys} irys - Initialized Irys client
 * @param {string} amount - Amount to fund in atomic units
 * @returns {Promise<Object>} Funding transaction result
 */
export async function fundIrys(irys, amount) {
  try {
    const fundTx = await irys.fund(amount);
    console.log('Irys funding successful:', fundTx);
    return fundTx;
  } catch (error) {
    console.error('Failed to fund Irys:', error);
    throw new Error(`Funding failed: ${error.message}`);
  }
}

/**
 * Upload data to Irys
 * @param {Irys} irys - Initialized Irys client
 * @param {Object} data - Data to upload
 * @param {Object} tags - Optional tags for the upload
 * @returns {Promise<Object>} Upload result with transaction ID
 */
export async function uploadToIrys(irys, data, tags = {}) {
  try {
    // Convert data to JSON string
    const jsonData = JSON.stringify(data);
    
    // Prepare tags
    const uploadTags = [
      { name: 'Content-Type', value: 'application/json' },
      { name: 'App-Name', value: 'BlockRef' },
      { name: 'App-Version', value: '1.0.0' },
      ...Object.entries(tags).map(([name, value]) => ({ name, value }))
    ];

    // Upload data
    const receipt = await irys.upload(jsonData, { tags: uploadTags });
    
    console.log('Data uploaded to Irys:', receipt);
    return {
      id: receipt.id,
      timestamp: receipt.timestamp,
      version: receipt.version,
      public: receipt.public,
      signature: receipt.signature,
      deadlineHeight: receipt.deadlineHeight,
      block: receipt.block,
      validatorSignatures: receipt.validatorSignatures,
      verify: receipt.verify
    };
  } catch (error) {
    console.error('Failed to upload to Irys:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }
}

/**
 * Retrieve data from Irys by transaction ID
 * @param {string} transactionId - Irys transaction ID
 * @returns {Promise<Object>} Retrieved data
 */
export async function retrieveFromIrys(transactionId) {
  try {
    const response = await fetch(`https://gateway.irys.xyz/${transactionId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to retrieve from Irys:', error);
    throw new Error(`Retrieval failed: ${error.message}`);
  }
}

/**
 * Get the cost of uploading data to Irys
 * @param {Irys} irys - Initialized Irys client
 * @param {Object} data - Data to estimate cost for
 * @returns {Promise<string>} Cost in atomic units
 */
export async function getUploadCost(irys, data) {
  try {
    const jsonData = JSON.stringify(data);
    const cost = await irys.getPrice(jsonData.length);
    return cost.toString();
  } catch (error) {
    console.error('Failed to get upload cost:', error);
    throw new Error(`Cost estimation failed: ${error.message}`);
  }
}

/**
 * Check if sufficient balance exists for upload
 * @param {Irys} irys - Initialized Irys client
 * @param {Object} data - Data to check cost for
 * @returns {Promise<Object>} Balance check result
 */
export async function checkSufficientBalance(irys, data) {
  try {
    const cost = await getUploadCost(irys, data);
    const balance = await getIrysBalance(irys);
    
    const hasSufficientBalance = BigInt(balance) >= BigInt(cost);
    
    return {
      cost,
      balance,
      hasSufficientBalance,
      shortfall: hasSufficientBalance ? '0' : (BigInt(cost) - BigInt(balance)).toString()
    };
  } catch (error) {
    console.error('Failed to check balance:', error);
    throw new Error(`Balance check failed: ${error.message}`);
  }
}

/**
 * Format atomic units to human readable format
 * @param {string} atomicUnits - Amount in atomic units
 * @param {number} decimals - Number of decimals (default 18 for ETH)
 * @returns {string} Formatted amount
 */
export function formatFromAtomic(atomicUnits, decimals = 18) {
  const divisor = BigInt(10 ** decimals);
  const quotient = BigInt(atomicUnits) / divisor;
  const remainder = BigInt(atomicUnits) % divisor;
  
  if (remainder === 0n) {
    return quotient.toString();
  }
  
  const remainderStr = remainder.toString().padStart(decimals, '0');
  const trimmedRemainder = remainderStr.replace(/0+$/, '');
  
  return `${quotient}.${trimmedRemainder}`;
}

/**
 * Convert human readable amount to atomic units
 * @param {string} amount - Human readable amount
 * @param {number} decimals - Number of decimals (default 18 for ETH)
 * @returns {string} Amount in atomic units
 */
export function formatToAtomic(amount, decimals = 18) {
  const [whole, fraction = ''] = amount.split('.');
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  return (BigInt(whole) * BigInt(10 ** decimals) + BigInt(paddedFraction)).toString();
}
