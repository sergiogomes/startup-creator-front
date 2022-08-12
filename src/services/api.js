import axios from 'axios';
import axiosRetry from 'axios-retry';

const url =
  process.env.NODE_ENV === 'development'
    ? 'https://vkhdmal19b.execute-api.sa-east-1.amazonaws.com/prod'
    : 'https://vkhdmal19b.execute-api.sa-east-1.amazonaws.com/prod';

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
    return 1000;
  },
  retryCondition: shouldRetry
});
export default api;
