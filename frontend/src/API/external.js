import axios from "axios";

const NEWS_API_KEY_END_POINT =
    "https://api.thenewsapi.net/crypto?apikey=0D462FA370D6D8D3CB6275A26C01F5A7&page=1&size=10&sort=published_at&order=desc";

const CRYPTO_API_END_POINT =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&locale=en";

// Cache configuration
const CACHE_DURATION = {
    NEWS: 10 * 60 * 1000, // 10 minutes for news
    CRYPTO: 10 * 60 * 1000, // 10 minutes for crypto
};

// Simple cache implementation
const cache = {
    news: { data: null, timestamp: null },
    crypto: { data: null, timestamp: null },
};

const isCacheValid = (cacheEntry, duration) => {
    return (
        cacheEntry.data &&
        cacheEntry.timestamp &&
        Date.now() - cacheEntry.timestamp < duration
    );
};

export const getNews = async () => {
    // Check cache first
    if (isCacheValid(cache.news, CACHE_DURATION.NEWS)) {
        console.log("Returning cached news data");
        return cache.news.data;
    }

    try {
        console.log("Fetching fresh news data");
        const response = await axios.get(NEWS_API_KEY_END_POINT);
        const newsData = response?.data?.data?.results || [];

        // Update cache
        cache.news = {
            data: newsData,
            timestamp: Date.now(),
        };

        return newsData;
    } catch (error) {
        console.error("Error fetching news:", error);

        // Return stale cache data if available, otherwise throw error
        if (cache.news.data) {
            console.log("API failed, returning stale cached news data");
            return cache.news.data;
        }

        throw error;
    }
};

export const getCrypto = async () => {
    // Check cache first
    if (isCacheValid(cache.crypto, CACHE_DURATION.CRYPTO)) {
        console.log("Returning cached crypto data");
        return cache.crypto.data;
    }

    try {
        console.log("Fetching fresh crypto data");
        const response = await axios.get(CRYPTO_API_END_POINT);
        const cryptoData = response.data || [];

        // Update cache
        cache.crypto = {
            data: cryptoData,
            timestamp: Date.now(),
        };

        return cryptoData;
    } catch (error) {
        console.error("Error fetching crypto:", error);

        // Return stale cache data if available, otherwise throw error
        if (cache.crypto.data) {
            console.log("API failed, returning stale cached crypto data");
            return cache.crypto.data;
        }

        throw error;
    }
};

// Optional: Manual cache clearing functions
export const clearNewsCache = () => {
    cache.news = { data: null, timestamp: null };
};

export const clearCryptoCache = () => {
    cache.crypto = { data: null, timestamp: null };
};

export const clearAllCache = () => {
    cache.news = { data: null, timestamp: null };
    cache.crypto = { data: null, timestamp: null };
};
