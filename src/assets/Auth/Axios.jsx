import React from "react";
import { E_SHOP_TOKEN, MAIN_URL } from "./authPaths";
import Cookies from "js-cookie";
import axios from "axios";

const token = Cookies.get(E_SHOP_TOKEN);

export const Axios = axios.create({
  baseURL: MAIN_URL,
  headers: { Authorization: token ? `Bearer ${token}` : "undefined " },
});

// request
Axios.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response
Axios.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => Promise.reject(error)
);
