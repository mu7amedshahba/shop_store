import axios from "axios";
import { E_SHOP_TOKEN, MAIN_URL } from "./authPaths";
import Cookies from "js-cookie";

const token = Cookies.get(E_SHOP_TOKEN);
const api = axios.create({
  baseURL: MAIN_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token} ` : "undefined",
  },
});

export const ApiServices = {
  getAll: () => api.get("product"),
  getById: (id) => api.get(`product/${id}`),
  create: (data) => api.post(`product`, data),
  update: (id, data) => api.post(`product/${id}`, data),
  delete: (id) => api.delete(`product/${id}`),
};

api.interceptors.request.use((config) => {
  const token = Cookies.get(E_SHOP_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// handleError
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    console.log("API Error", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

// handle 401 error
let isRefreshing = false;
let failQueue = [];
const processQueue = (err, token = null) => {
  failQueue.forEach((prom) => {
    if (err) prom.reject(err);
    else prom.resolve(token);
  });
  failQueue = [];
};

export const AuthServices = {
  login: (credential) => api.post(`/auth/login`, credential),
  register: (data) => api.post(`/auth/register`, data),
};
