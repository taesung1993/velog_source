import { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "nookies";
import { getRefreshToken } from "@/lib/services/token.service";
import { ErrorCodes, IError, ISuccess } from "@/lib/types/api";

interface SignInRequest extends NextApiRequest {
  body: {
    email: string;
    password: string;
  };
}

export default async function signIn(
  req: SignInRequest,
  res: NextApiResponse<ISuccess<string> | IError>
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      code: ErrorCodes.METHOD_NOT_ALLOWED,
      message: "허용되지 않은 메소드입니다.",
    });
  }

  try {
    const payload = {
      email: req.body.email,
    };
    const refreshToken = await getRefreshToken(payload);

    setCookie({ res }, "refreshToken", refreshToken, {
      maxAge: 14 * 24 * 60 * 60,
      path: "/",
      httpOnly: true,
    });

    return res.status(200).json({
      success: true,
      data: "로그인이 완료되었습니다.",
    });
  } catch (error) {
    return res.status(500).json({
      code: ErrorCodes.SERVER_ERROR,
      message: "서버 에러가 발생했습니다.",
    });
  }
}
