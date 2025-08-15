// Currency formatting utility

// Currency symbols mapping
const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥',
  BTC: '₿',
  ETH: 'Ξ'
};

// Currency locale mapping for proper number formatting
const CURRENCY_LOCALES = {
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  INR: 'en-IN',
  JPY: 'ja-JP',
  BTC: 'en-US',
  ETH: 'en-US'
};

/**
 * Format currency value based on the selected currency
 * @param {number} value - The numeric value to format
 * @param {string} currency - The currency code (USD, EUR, GBP, INR, JPY, BTC, ETH)
 * @param {object} options - Additional formatting options
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, currency = 'USD', options = {}) => {
  const {
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    compact = false
  } = options;

  // Handle crypto currencies differently
  if (currency === 'BTC' || currency === 'ETH') {
    const symbol = CURRENCY_SYMBOLS[currency];
    if (compact && value >= 1000) {
      if (value >= 1e9) return `${symbol}${(value / 1e9).toFixed(2)}B`;
      if (value >= 1e6) return `${symbol}${(value / 1e6).toFixed(2)}M`;
      if (value >= 1e3) return `${symbol}${(value / 1e3).toFixed(2)}K`;
    }
    return `${symbol}${value.toFixed(maximumFractionDigits)}`;
  }

  // Handle fiat currencies
  const locale = CURRENCY_LOCALES[currency] || 'en-US';
  
  try {
    // For compact formatting (large numbers)
    if (compact) {
      if (value >= 1e12) return `${CURRENCY_SYMBOLS[currency]}${(value / 1e12).toFixed(2)}T`;
      if (value >= 1e9) return `${CURRENCY_SYMBOLS[currency]}${(value / 1e9).toFixed(2)}B`;
      if (value >= 1e6) return `${CURRENCY_SYMBOLS[currency]}${(value / 1e6).toFixed(2)}M`;
      if (value >= 1e3) return `${CURRENCY_SYMBOLS[currency]}${(value / 1e3).toFixed(2)}K`;
    }

    // Use Intl.NumberFormat for proper localization
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits,
      maximumFractionDigits
    }).format(value);
  } catch (error) {
    // Fallback to manual formatting if Intl.NumberFormat fails
    const symbol = CURRENCY_SYMBOLS[currency] || '$';
    return `${symbol}${value.toFixed(maximumFractionDigits)}`;
  }
};

/**
 * Format price with appropriate precision based on value
 * @param {number} price - The price value
 * @param {string} currency - The currency code
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, currency = 'USD') => {
  if (price < 0.01) {
    return formatCurrency(price, currency, { maximumFractionDigits: 6 });
  }
  if (price < 1) {
    return formatCurrency(price, currency, { maximumFractionDigits: 4 });
  }
  return formatCurrency(price, currency);
};

/**
 * Format large numbers with compact notation
 * @param {number} value - The numeric value
 * @param {string} currency - The currency code
 * @returns {string} Formatted compact currency string
 */
export const formatCompactCurrency = (value, currency = 'USD') => {
  return formatCurrency(value, currency, { compact: true });
};

/**
 * Get currency symbol for a given currency code
 * @param {string} currency - The currency code
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (currency = 'USD') => {
  return CURRENCY_SYMBOLS[currency] || '$';
};

/**
 * Format percentage value
 * @param {number} value - The percentage value
 * @returns {string} Formatted percentage string
 */
export const formatPercent = (value) => {
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
};

/**
 * Format number with appropriate decimal places
 * @param {number} value - The numeric value
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number string
 */
export const formatNumber = (value, decimals = 4) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  }).format(value);
};