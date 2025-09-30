import { Request, Response } from "express";
import { OTPService } from "./otp.service";
import { sendResponse } from "../../utils/sendRespons";



const sendOTP = async (req: Request, res: Response) => {
    const { email } = req.body
    await OTPService.sendOTP(email)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "OTP sent successfully",
        data: null,
    });
}

const verifyOTP = async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    await OTPService.verifyOTP(email, otp)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "OTP verified successfully",
        data: null,
    });
}

export const OTPController = {
    sendOTP,
    verifyOTP
};