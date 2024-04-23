import * as jose from "jose";

/**
 * @description  JWT 토큰을 생성에 필요한 비밀키를 반환합니다.
 * @returns {Uint8Array}
 */
const getJwtSecretKey = () => {
  return new TextEncoder().encode("your-secret-key");
};

/**
 * @description  JWT 토큰을 생성합니다.
 * @param {{email: string}} payload
 * @param {number} expiresIn - 토큰의 만료 시간(초)
 * @returns {Promise<string>}
 */
const createToken = (payload: { email: string }, expiresIn: number) => {
  const secretKey = getJwtSecretKey();
  const createdAt = new Date();
  const expiredAt = new Date(createdAt.getTime() + expiresIn * 1000);

  return new jose.SignJWT({
    ...payload,
    createdAt: createdAt.toISOString(),
    expiredAt: expiredAt.toISOString(),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(createdAt)
    .setExpirationTime(expiredAt)
    .sign(secretKey);
};

/**
 * @description  Access 토큰을 생성합니다.
 * @param {{email: string}} payload
 * @returns {Promise<string>}
 */
const getAccessToken = (payload: { email: string }) => {
  return createToken(payload, 60);
};

/**
 * @description  Refresh 토큰을 생성합니다.
 * @param {{email: string}} payload
 * @returns {Promise<string>}
 */
const getRefreshToken = (payload: { email: string }) => {
  return createToken(payload, 60 * 60 * 24 * 14);
};

/**
 * @description  토큰의 유효성을 검증합니다.
 * @param {string} token
 * @returns {Promise<jose.JWTVerifyResult<jose.JWTPayload>>}
 */
const verifyToken = (
  token: string
): Promise<jose.JWTVerifyResult<jose.JWTPayload>> => {
  const secretKey = getJwtSecretKey();
  return jose.jwtVerify(token, secretKey);
};

/**
 * @description 토큰을 해석(디코딩)합니다.
 * @param {string}token
 * @returns {jose.JWTPayload}
 */
const decodeToken = (token: string) => jose.decodeJwt(token);

export {
  getJwtSecretKey,
  getRefreshToken,
  getAccessToken,
  verifyToken,
  decodeToken,
};
