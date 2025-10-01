// middleware/checkAuth.ts
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../errorHelpers/AppError";
import { User } from "../modules/user/user.model";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/envVars";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
             const accessToken = req.headers.authorization;

        if (!accessToken) {
            throw new AppError(403, "No Token Recieved")
        }
     const verifiedToken = verifyToken(accessToken, envVars.JWT_SECRET) as JwtPayload & { id: string; email: string; role: string; }

     const isUserExist = await User.findOne({ email: verifiedToken.email })

        if (!isUserExist) {
            throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
        }
        if (!isUserExist.isVerified) {
            throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")
        }
    

        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(403, "You are not permitted to view this route!!!")
        }
        req.user = verifiedToken
        next()

    } catch (error) {
        next(error)
    }
  };
