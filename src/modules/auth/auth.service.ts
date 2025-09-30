/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { IUser } from "../user/user.interface";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/envVars";
import { generateToken } from "../../utils/jwt";
import { sendEmail } from "../../utils/sendEmail";
import { generateOtp, OTP_EXPIRATION } from "../otp/otp.service";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Email does not exist");
  }

  if (!isUserExist.isVerified) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "Please verify your email before logging in"
    );
  }

  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );
  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Incorrect Password");
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_SECRET,
    envVars.JWT_EXPIRED
  );

  const { password: pass, ...rest } = isUserExist.toObject();

  return {
    accessToken,
    user: rest,
  };
};

const sendPasswordResetOTP = async (email: string) => {
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
    subject: "Reset Password OTP",
    htmlBody: `<p>Your OTP to reset password is <strong>${otp}</strong></p>`,
  });

  return { message: "OTP sent to email" };
};

const verifyResetOTP = async (email: string, otp: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError(404, "User not found");

  if (!user.otp || user.otp.code !== otp) {
    throw new AppError(400, "Invalid OTP");
  }

  const isExpired = new Date() > new Date(user.otp.expiresAt);
  if (isExpired) {
    throw new AppError(400, "OTP expired");
  }

  user.otp.verified = true;
  await user.save();

  return { message: "OTP verified successfully." };
};


const resetPasswordWithOTP = async (
  email: string,
  newPassword: string,
  confirmPassword: string
) => {
  if (newPassword !== confirmPassword) {
    throw new AppError(400, "Passwords do not match");
  }

  const user = await User.findOne({ email });
  if (!user) throw new AppError(404, "User not found");

  if (!user.otp?.verified) {
    throw new AppError(403, "OTP not verified");
  }

  user.password = await bcryptjs.hash(newPassword, 10);
  user.otp = undefined; // Clear OTP after successful reset
  await user.save();

  return { message: "Password has been reset successfully." };
};

export const AuthServices = {
  credentialsLogin,
  sendPasswordResetOTP,
  resetPasswordWithOTP,
  verifyResetOTP
};
