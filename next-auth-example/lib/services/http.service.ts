import axios from "axios";

/**
 * @description Axios 인스턴스를 생성합니다.
 * @constant
 */
const http = axios.create();

/**
 * @description AccessToken을 Authorization에 설정합니다.
 * @param {string} accessToken
 */
const setAccessToken = (accessToken: string) => {
  http.defaults.headers.Authorization = `Bearer ${accessToken}`;
};

/**
 * @description AccessToken을 Authorization에서 삭제합니다.
 */
const deleteAccessToken = () => {
  delete http.defaults.headers.Authorization;
};

export { http, setAccessToken, deleteAccessToken };
