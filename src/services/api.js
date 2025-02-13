import axios from 'axios';
import axiosRetry from 'axios-retry';

const url =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:2025'
    : '#UrlDeProducao';

const api = axios.create({ baseURL: url });
const shouldRetry = error => {
  return axiosRetry.isNetworkError(error) ||
    axiosRetry.isRetryableError(error) ||
    error.code === 'ECONNABORTED' ||
    (error.response && error.response.status === 400);
};
axiosRetry(api, { 
  retries: 4 ,
  retryDelay: (retryCount) => {
    return 500;
  },
  retryCondition: shouldRetry
});
export default api;
