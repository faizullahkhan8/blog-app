import axios from "axios";

const NEWS_API_KEY_END_POINT = `https://newsapi.org/v2/everything?q=business AND blockchain&sortBy=publishedAt&language=en&apiKey=c35aba4af67c425d8fea5f5d4857e780`;

const CRYPTO_API_END_POINT =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&locale=en";

export const getNews = async () => {
  let response;
  try {
    response = await axios.get(NEWS_API_KEY_END_POINT);
    response = response.data.articles.slice(0, 20);
  } catch (error) {
    return error;
  }
  return response;
};

export const getCrypto = async () => {
  let response;

  try {
    response = await axios.get(CRYPTO_API_END_POINT);
    response = response.data;
  } catch (error) {
    return error;
  }
  return response;
};
