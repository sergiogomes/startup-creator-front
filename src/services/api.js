import axios from 'axios';
import axiosRetry from 'axios-retry';

const url =
  process.env.NODE_ENV === 'development'
    ? 'https://fult5o9ub7.execute-api.sa-east-1.amazonaws.com/prod'
    : 'https://fult5o9ub7.execute-api.sa-east-1.amazonaws.com/prod';

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
