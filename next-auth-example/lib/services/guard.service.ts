import { NextRequest, NextResponse, URLPattern } from "next/server";
import { verifyToken } from "./token.service";

/** 
    @constant
    @description 라우트 정보를 담은 배열
*/
export const routes: {
  [key: string]: {
    pattern: URLPattern;
    isPublic: boolean;
  };
} = {
  home: {
    pattern: new URLPattern({ pathname: "/" }),
    isPublic: true,
  },
  signIn: {
    pattern: new URLPattern({ pathname: "/sign-in" }),
    isPublic: true,
  },
  me: {
    pattern: new URLPattern({ pathname: "/user/me" }),
    isPublic: false,
  },
};

/**
 * @description 라우트가 public인지 확인한다.
 * @param {string} route middleware.ts에서 req.url을 넘겨준다.
 * @returns {boolean}
 */
export const isPublicRoute = (route: string) => {
  for (const id in routes) {
    const { pattern, isPublic } = routes[id];
    if (pattern.exec(route) && isPublic) {
      return true;
    }
  }

  return false;
};

/**
 * @description 로그인 페이지로 접근하는지 확인한다.
 * @param {string} route middleware.ts에서 req.url을 넘겨준다.
 * @returns {boolean}
 */
export const isToAccessSignInPage = (route: string) => {
  const signInPattern = routes.signIn;

  if (signInPattern.pattern.exec(route)) {
    return true;
  }

  return false;
};

/**
 * @description 미들웨어에서 로그아웃 처리를 한다.
 * @param {NextResponse<T extends unknown>} res
 * @returns NextResponse<T extends unknown>
 */
export const nextWithLogout = <T extends unknown>(
  res: NextResponse<T>
): NextResponse<T> => {
  res.cookies.set({
    name: "refreshToken",
    httpOnly: true,
    value: "",
    path: "/",
    maxAge: -1,
  });

  return res;
};

/**
 * @description 쿠키안에 저장되어 있는 refreshToken의 유효성, 만료 여부를 확인하여 로그아웃 여부를 판단한다.
 * @param {NextRequest} req
 * @returns {boolean}
 */
export const determineLogout = async (req: NextRequest) => {
  const cookies = req.cookies;
  const refreshToken = cookies.get("refreshToken");

  if (refreshToken) {
    try {
      await verifyToken(refreshToken.value);
      return false;
    } catch (error) {
      console.error("error in determineLogout function");
      return true;
    }
  }

  return true;
};

/**
 * public 페이지에 접속했을 때 미들웨어에서 요청, 응답 처리
 * @param {boolean} logout
 * @param {string} url
 * @returns {NextResponse<unknown>}
 */
export const withoutAuth = (shouldLogout: boolean, url: string) => {
  let response = NextResponse.next();

  if (shouldLogout) {
    return nextWithLogout(response);
  }

  if (isToAccessSignInPage(url)) {
    response = NextResponse.redirect(new URL("/", url));
    return response;
  }

  return response;
};

/**
 * private 페이지에 접속했을 때 미들웨어에서 요청, 응답 처리
 * @param {boolean} logout
 * @returns {NextResponse<unknown>}
 */
export const withAuth = (shouldLogout: boolean, url: string) => {
  const response = NextResponse.next();

  if (shouldLogout) {
    const response = NextResponse.redirect(new URL("/sign-in", url));
    return nextWithLogout(response);
  }

  return response;
};
