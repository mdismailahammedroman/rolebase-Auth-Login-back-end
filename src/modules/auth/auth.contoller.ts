import { NextFunction, Request, Response } from "express";
import { AuthServices } from "./auth.service";
import { sendResponse } from "../../utils/sendRespons";
import { StatusCodes } from "http-status-codes";




const credentialsLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loginInfo = await AuthServices.credentialsLogin(req.body);

        sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: "User Logged In Successfully",
            data: loginInfo,
        });
    } catch (error) {
        next(error);
    }
};



const logout = async (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "Production",
    sameSite: "strict",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "Production",
    sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
const PasswordResetController = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const result = await AuthServices.sendPasswordResetOTP(email);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: result.message,
        data: null,
      });
    } catch (err) {
      next(err);
    }
  }

const verifyResetOTP= async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, otp } = req.body;
      const result = await AuthServices.verifyResetOTP(email, otp);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: result.message,
        data: null,
      });
    } catch (err) {
      next(err);
    }
  }
  

const resetPassword= async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, newPassword, confirmPassword } = req.body;
      const result = await AuthServices.resetPasswordWithOTP(email, newPassword, confirmPassword);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: result.message,
        data: null,
      });
    } catch (err) {
      next(err);
    }
  }
 
export const AuthController = {
    credentialsLogin,
    logout,
    PasswordResetController,
      verifyResetOTP, 
    resetPassword,

    
};
