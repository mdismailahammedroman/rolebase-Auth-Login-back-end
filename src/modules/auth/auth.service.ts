/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { IUser } from "../user/user.interface";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/envVars";
import { generateToken } from "../../utils/jwt";

const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload;

    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Email does not exist");
    }

    if (!isUserExist.isVerified) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Please verify your email before logging in");
    }

    const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string);
    if (!isPasswordMatched) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Incorrect Password");
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role,
    };

    const accessToken = generateToken(jwtPayload, envVars.JWT_SECRET, envVars.JWT_EXPIRED);

    const { password: pass, ...rest } = isUserExist.toObject();

    return {
        accessToken,
        user: rest
    };
};


export const AuthServices = { credentialsLogin };
