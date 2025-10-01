export type UserRole = 'customer' | 'serviceProvider';

export enum Role {
  USER = "customer",
  SERVICEPROVIDER = "serviceProvider",
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  picture?: string;
  address?: string;
  role: UserRole;
  isOnline: boolean;
   otp?: {
    code: string;
    expiresAt: Date;
    verified: boolean;
  };
isVerified: boolean;
  otpExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}