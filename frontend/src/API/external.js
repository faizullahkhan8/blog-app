import axios from "axios";

const NEWS_API_KEY_END_POINT =
    "https://api.thenewsapi.net/crypto?apikey=0D462FA370D6D8D3CB6275A26C01F5A7&page=1&size=10&sort=published_at&order=desc";

const CRYPTO_API_END_POINT =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&locale=en";

export const getCryptoNews = async () =>
    axios.get(NEWS_API_KEY_END_POINT).then((res) => res.data.data);

export const getCryptoData = async () =>
    axios.get(CRYPTO_API_END_POINT).then((res) => res.data);
