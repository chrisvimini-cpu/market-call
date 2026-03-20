import { API_CONFIG } from './constants.js';
import { STABLECOINS } from './tokens.js';
import { loadPriceCache, savePriceCache, loadTokenPool, saveTokenPool } from './storage.js';

/**
 * Fetch top tokens by market cap, excluding stablecoins
 */
export async function fetchTokenPool() {
  // Check cache first
  const cached = loadTokenPool();
  if (cached) return cached;

  try {
    const url = `${API_CONFIG.COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&sparkline=false`;
    const headers = API_CONFIG.COINGECKO_API_KEY
      ? { 'x-cg-demo-api-key': API_CONFIG.COINGECKO_API_KEY }
      : {};

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();

    // Filter out stablecoins and non-volatile tokens, then take EXACTLY top 50 by market cap
    const filtered = data
      .filter(token => !STABLECOINS.includes(token.id))
      .slice(0, 50);

    console.log('Token pool after filtering:', filtered.map(t => `${t.market_cap_rank}. ${t.symbol.toUpperCase()}`));

    saveTokenPool(filtered);
    return filtered;
  } catch (error) {
    console.error('Failed to fetch token pool:', error);
    throw new Error('Unable to fetch token data. Please try again later.');
  }
}

/**
 * Fetch current prices for multiple tokens in a single batch request
 */
export async function fetchTokenPrices(tokenIds) {
  const idsString = tokenIds.join(',');

  try {
    const url = `${API_CONFIG.COINGECKO_BASE}/coins/markets?vs_currency=usd&ids=${idsString}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`;
    const headers = API_CONFIG.COINGECKO_API_KEY
      ? { 'x-cg-demo-api-key': API_CONFIG.COINGECKO_API_KEY }
      : {};

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform to easier lookup format
    const priceData = {};
    data.forEach(token => {
      priceData[token.id] = {
        id: token.id,
        symbol: token.symbol,
        name: token.name,
        image: token.image,
        current_price: token.current_price,
        price_change_percentage_24h: token.price_change_percentage_24h,
        market_cap_rank: token.market_cap_rank,
      };
    });

    return priceData;
  } catch (error) {
    console.error('Failed to fetch token prices:', error);
    throw new Error('Unable to fetch price data. Please try again later.');
  }
}

/**
 * Fetch 7-day sparkline data for a token
 */
export async function fetchSparkline(tokenId) {
  // Check cache first
  const cache = loadPriceCache();
  const cacheKey = `sparkline_${tokenId}`;

  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < API_CONFIG.CACHE_TTL) {
    return cache[cacheKey].data;
  }

  try {
    const url = `${API_CONFIG.COINGECKO_BASE}/coins/${tokenId}/market_chart?vs_currency=usd&days=7&interval=daily`;
    const headers = API_CONFIG.COINGECKO_API_KEY
      ? { 'x-cg-demo-api-key': API_CONFIG.COINGECKO_API_KEY }
      : {};

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    const sparklineData = data.prices.map(([timestamp, price]) => price);

    // Cache the result
    cache[cacheKey] = {
      data: sparklineData,
      timestamp: Date.now(),
    };
    savePriceCache(cache);

    return sparklineData;
  } catch (error) {
    console.error(`Failed to fetch sparkline for ${tokenId}:`, error);
    // Return empty array on error so the component can render without sparkline
    return [];
  }
}

/**
 * Fetch sparklines for multiple tokens (with rate limiting)
 */
export async function fetchMultipleSparklines(tokenIds) {
  const sparklines = {};

  for (const tokenId of tokenIds) {
    try {
      sparklines[tokenId] = await fetchSparkline(tokenId);
      // Small delay to avoid rate limiting
      await delay(300);
    } catch (error) {
      console.error(`Error fetching sparkline for ${tokenId}:`, error);
      sparklines[tokenId] = [];
    }
  }

  return sparklines;
}

/**
 * Fetch historical price from 24 hours ago (for demo mode)
 */
export async function fetchHistoricalPrice(tokenId, hoursAgo = 24) {
  try {
    const url = `${API_CONFIG.COINGECKO_BASE}/coins/${tokenId}/market_chart?vs_currency=usd&days=1`;
    const headers = API_CONFIG.COINGECKO_API_KEY
      ? { 'x-cg-demo-api-key': API_CONFIG.COINGECKO_API_KEY }
      : {};

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();

    // Get the first price point (24 hours ago)
    if (data.prices && data.prices.length > 0) {
      return data.prices[0][1];
    }

    throw new Error('No historical data available');
  } catch (error) {
    console.error(`Failed to fetch historical price for ${tokenId}:`, error);
    return null;
  }
}

/**
 * Fetch historical prices for multiple tokens
 */
export async function fetchMultipleHistoricalPrices(tokenIds) {
  const historicalPrices = {};

  for (const tokenId of tokenIds) {
    try {
      historicalPrices[tokenId] = await fetchHistoricalPrice(tokenId);
      // Small delay to avoid rate limiting
      await delay(300);
    } catch (error) {
      console.error(`Error fetching historical price for ${tokenId}:`, error);
      historicalPrices[tokenId] = null;
    }
  }

  return historicalPrices;
}

/**
 * Simple delay utility
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Format price with appropriate decimal places
 */
export function formatPrice(price) {
  if (price >= 1000) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  } else if (price >= 1) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else if (price >= 0.01) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  } else {
    return price.toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 });
  }
}

/**
 * Format percentage change
 */
export function formatPercentage(percentage) {
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${percentage.toFixed(2)}%`;
}
