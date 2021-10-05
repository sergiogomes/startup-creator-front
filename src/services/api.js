import axios from 'axios';

const url =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3334'
    : 'http://api.plataformagame.com.br';

const api = axios.create({ baseURL: url });

export default api;
