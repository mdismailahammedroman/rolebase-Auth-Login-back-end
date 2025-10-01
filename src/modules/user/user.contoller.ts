/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendRespons";
import { UserServices } from "./user.service";
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { JwtPayload } from "jsonwebtoken";

const createUser=async (req:Request, res:Response, next:NextFunction)=>{

   const user = await UserServices.createUser(req.body)
   sendResponse(res,{
           success: true,
        statusCode: StatusCodes.CREATED,
        message: "Account Created Successfully!",
        data: user,
   })

}
const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError(401, "Unauthorized: User ID missing from token");
    }

    const user = await UserServices.getUserById(userId);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    const { password, otp, ...safeUser } = user.toObject();

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User profile retrieved successfully",
      data: safeUser,
    });
  } catch (error) {
    next(error);
  }
};


export const UserControllers={
    createUser,
    getMyProfile
}