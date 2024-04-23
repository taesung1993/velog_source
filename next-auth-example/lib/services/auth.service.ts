import { AxiosResponse } from "axios";
import { http } from "./http.service";
import { ISuccess } from "../types/api";
import { IAuth } from "../types/auth";

/**
 * @description 로그인 요청을 합니다.
 * @param {{email: string; password: string;}} payload
 * @returns {Promise<AxiosResponse<ISuccess<string>>>}
 */
const login = (payload: { email: string; password: string }) => {
  return http.post("/api/sign-in", payload);
};

/**
 * @description 로그아웃 요청을 합니다.
 * @returns {Promise<AxiosResponse<ISuccess<string>>>}
 */
const logout = () => {
  return http.post("/api/sign-out");
};

/**
 * @description 토큰 갱신 요청을 합니다.
 * @returns {Promise<AxiosResponse<ISuccess<IAuth>>>}
 */
const refresh = (): Promise<AxiosResponse<ISuccess<IAuth>>> => {
  return http.get("/api/auth/token");
};

export { login, logout, refresh };
