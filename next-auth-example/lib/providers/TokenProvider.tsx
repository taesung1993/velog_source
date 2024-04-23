import { useQuery } from "@tanstack/react-query";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useRef,
} from "react";
import { logout, refresh } from "../services/auth.service";
import { useMemo } from "react";
import { deleteAccessToken, setAccessToken } from "../services/http.service";
import { IAuth } from "../types/auth";
import { decodeToken } from "../services/token.service";
import { useRouter } from "next/router";

const TokenContext = createContext<({ refetch: () => void } & IAuth) | null>(
  null
);

export const useTokenContext = () => {
  const context = useContext(TokenContext);

  if (context === null) {
    throw new Error(
      "useTokenContext는 TokenProvider 내에서 사용되어야 합니다."
    );
  }

  return context;
};

const defaultAuth: IAuth = {
  ready: false,
  isLoggedIn: false,
  accessToken: null,
  refreshToken: null,
};

export default function TokenProvider({ children }: PropsWithChildren) {
  const { isLoading, isError, data, refetch } = useQuery({
    queryKey: ["api/auth/token"],
    queryFn: () => refresh(),
    refetchOnWindowFocus: true,
    staleTime: 0,
    select: (data) => data.data,
  });
  const accessTimer = useRef<NodeJS.Timeout | null>(null);
  const refreshTimer = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const auth = useMemo(() => {
    if (isLoading || isError || !data) {
      return defaultAuth;
    }

    return data.data;
  }, [data, isLoading, isError]);

  useEffect(() => {
    const { accessToken, refreshToken } = auth;

    if (refreshToken) {
      const delay = getTimerDelayFromToken({
        type: "refresh",
        token: refreshToken!,
      });

      refreshTimer.current = setTimeout(async () => {
        await logout();
        router.reload();
      }, delay);
    }

    if (accessToken) {
      setAccessToken(accessToken!);

      const delay = getTimerDelayFromToken({
        type: "access",
        token: accessToken!,
      });
      accessTimer.current = setTimeout(() => {
        refetch();
      }, delay);
    } else {
      deleteAccessToken();
    }

    return () => {
      if (accessTimer.current) {
        clearTimeout(accessTimer.current);
      }

      if (refreshTimer.current) {
        clearTimeout(refreshTimer.current);
      }
    };
  }, [auth]);

  return (
    <TokenContext.Provider value={{ ...auth, refetch }}>
      {children}
    </TokenContext.Provider>
  );
}

/**
 * @description 토큰의 만료 시간을 기반으로 타이머의 딜레이를 계산합니다.
 * @param {Object} param
 * @param {string} param.type
 * @param {string} param.token
 * @returns {number}
 */
const getTimerDelayFromToken = ({
  type,
  token,
}: {
  type: "refresh" | "access";
  token: string;
}) => {
  const { expiredAt } = decodeToken(token!);

  switch (type) {
    case "access":
      return (
        Math.ceil(
          (+new Date(expiredAt as string) - (Date.now() + 1000 * 30)) / 10
        ) * 10
      );
    case "refresh":
      return +new Date(expiredAt as string) - Date.now();
    default:
      throw new Error("Invalid token type");
  }
};
