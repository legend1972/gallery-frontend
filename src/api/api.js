import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true
});

api.interceptors.response.use(
  response => response,
  error => {
    if(error.response?.status === 401) {
      console.log("인증이 필요하거나 세션이 만료되었습니다.");
      //const requestUrl = error.config?.url ?? "";

      // if(window.location.pathname !== "/login") {
      //   window.location.href = "/login";
      // }
    }

    return Promise.reject(error);
  }
);

export default api;