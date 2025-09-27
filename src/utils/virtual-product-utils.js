// Utility functions for virtual products (gift cards, etc.)

/**
 * Generate a unique gift card code
 * Format: XXXX-XXXX-XXXX-XXXX (alphanumeric)
 */
export const generateGiftCardCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segments = [4, 4, 4, 4]; // 4 segments of 4 characters each
  
  return segments.map(segment => {
    let result = '';
    for (let i = 0; i < segment; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }).join('-');
};

/**
 * Validate a gift card code format
 */
export const isValidGiftCardCode = (code) => {
  const regex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  return regex.test(code);
};

/**
 * Check if a virtual product is ready for activation
 */
export const isVirtualProductReady = (product) => {
  return product.isVirtual && product.virtualStatus === 'active' && product.virtualCode;
};

/**
 * Get virtual product status display text
 */
export const getVirtualStatusText = (status) => {
  const statusMap = {
    'pending': 'Pending',
    'active': 'Active',
    'used': 'Used',
    'expired': 'Expired'
  };
  return statusMap[status] || 'Unknown';
};

/**
 * Check if virtual code is expired
 */
export const isCodeExpired = (expiryDate) => {
  if (!expiryDate) return false;
  return new Date(expiryDate) < new Date();
};

/**
 * Format expiry date for display
 */
export const formatExpiryDate = (date) => {
  if (!date) return 'No expiry';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
