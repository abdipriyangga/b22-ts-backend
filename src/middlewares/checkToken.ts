import { Request, Response } from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
const { APP_SECRET_KEY } = process.env;

interface AuthRequest extends Request {
  authUser: string | JwtPayload
}

const authMiddleware = (req: AuthRequest, res: Response, next: Function) => {
  const header = req.headers;
  if (header.authorization) {
    if (header.authorization.startsWith("Bearer")) {
      try {
        const token = header.authorization.slice(7);
        const user = jwt.verify(token, APP_SECRET_KEY  || "");
        req.authUser = user;
        next();
      } catch (error) {
        return res.json({
          success: false,
          message: "Auth error!"
        })
      }
    }
  } else {
    return res.json({
      success: false,
      message: "Auth token needed!"
    })
  }
}

export default authMiddleware;