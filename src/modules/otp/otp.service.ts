import crypto from "crypto";
import { User } from "../user/user.model";
import AppError from "../../errorHelpers/AppError";
import { sendEmail } from "../../utils/sendEmail";


export const OTP_EXPIRATION = 2 * 60; 

export const generateOtp = (length = 6) => {
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
  return otp;
};

const sendOTP = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError(404, "User not found");

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_EXPIRATION * 1000); 

  user.otp = {
    code: otp,
    expiresAt,
    verified: false,
  };

  await user.save();

 await sendEmail(email, otp, {
  to: email,
  subject: "Your OTP Code",
  htmlBody: `<p>Your OTP code is: <strong>${otp}</strong></p>`,
});



  return { message: "OTP sent to email" };
};

const verifyOTP = async (email: string, otp: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.otp?.verified) {
    throw new AppError(400, "User already verified");
  }

  if (!user.otp || !user.otp.code || !user.otp.expiresAt) {
    throw new AppError(400, "No OTP found or OTP not set");
  }

  const isExpired = new Date() > new Date(user.otp.expiresAt);

  if (isExpired) {
    throw new AppError(400, "OTP expired. Please request a new one.");
  }

  if (user.otp.code !== otp) {
    throw new AppError(400, "Invalid OTP");
  }

  user.otp.verified = true;
  user.isVerified = true;
  await user.save();

  return { message: "OTP verified successfully" };
};

export const OTPService = {
  sendOTP,
  verifyOTP,
};
