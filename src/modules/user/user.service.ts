import { StatusCodes } from "http-status-codes";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";
import AppError from "../../errorHelpers/AppError";
import { envVars } from "../../config/envVars";
import { sendEmail } from "../../utils/sendEmail";
import { generateOtp, OTP_EXPIRATION } from "../otp/otp.service";




const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;


  if (!email) {
  throw new AppError(400, "Email is required");
}

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User Already Exist");
  }

  const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND));

  const user = await User.create({
    email,
    password: hashedPassword,
    ...rest,
  });

  // Generate OTP
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_EXPIRATION * 1000);

  user.otp = {
    code: otp,
    expiresAt,
    verified: false,
  };

  await user.save();

  // Send OTP email
 await sendEmail(email, otp, {
  to: email,
  subject: "Your OTP Code",
  htmlBody: `<p>Your OTP code is: <strong>${otp}</strong></p>`,
});

  return user;
};

export const UserServices={
    createUser
}