import { ErrorCodes, IError, ISuccess } from "@/lib/types/api";
import { NextApiRequest, NextApiResponse } from "next";
import { destroyCookie } from "nookies";

export default function signOut(
  req: NextApiRequest,
  res: NextApiResponse<ISuccess<string> | IError>
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      code: ErrorCodes.METHOD_NOT_ALLOWED,
      message: "허용되지 않은 메소드입니다.",
    });
  }

  try {
    destroyCookie({ res }, "refreshToken", {
      path: "/",
      httpOnly: true,
    });

    destroyCookie({ res }, "logged-in", {
      path: "/",
    });

    return res.status(200).json({
      success: true,
      data: "로그아웃이 완료되었습니다.",
    });
  } catch (error) {
    return res.status(500).json({
      code: ErrorCodes.SERVER_ERROR,
      message: "서버 에러가 발생했습니다.",
    });
  }
}
