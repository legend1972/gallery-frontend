import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true
});

api.interceptors.response.use(
  response => response,
  error => {
    if(error.response?.status === 401) {
      const requestUrl = error.config?.url;

      // 로그인 상태 확인 API는 정상적인 비회원 상태일 수 있으므로 조용히 넘김
      if (requestUrl !== "/member/me" && requestUrl !== "/role/routes" ) {
        console.log("인증이 필요하거나 세션이 만료되었습니다.");
      }
    }

    return Promise.reject(error);
  }
);

export default api;