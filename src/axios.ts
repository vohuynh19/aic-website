import axios from "axios";

const http = axios.create({
  url: "http://localhost:5454/query",
  timeout: 30000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use(
  (config) => {
    config.headers = {
      ...config.headers,
    };
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error.response?.data);
  }
);

http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(error);

    return Promise.reject(error.response?.data);
  }
);

export default http;
