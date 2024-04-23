import { decodeToken, getAccessToken } from "@/lib/services/token.service";
import { ErrorCodes, IError, ISuccess } from "@/lib/types/api";
import { IAuth } from "@/lib/types/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function token(
  req: NextApiRequest,
  res: NextApiResponse<ISuccess<IAuth> | IError>
) {
  if (req.method !== "GET") {
    return res.status(405).end({
      code: ErrorCodes.METHOD_NOT_ALLOWED,
      message: "허용되지 않은 메소드입니다.",
    });
  }

  try {
    const refreshToken = req.cookies?.refreshToken ?? null;

    if (refreshToken) {
      const decodedRefresh = decodeToken(refreshToken);
      const accessToken = await getAccessToken({
        email: decodedRefresh.email as string,
      });

      return res.status(200).json({
        success: true,
        data: {
          ready: true,
          isLoggedIn: true,
          accessToken,
          refreshToken,
        },
      });
    } else {
      return res.status(200).json({
        success: false,
        data: {
          ready: true,
          isLoggedIn: false,
          accessToken: null,
          refreshToken: null,
        },
      });
    }
  } catch (error) {
    return res.status(500).end({
      code: ErrorCodes.SERVER_ERROR,
      message: "서버 에러가 발생했습니다.",
    });
  }
}
