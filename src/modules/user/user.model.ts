
import { model, Schema } from 'mongoose';
import { IUser } from './user.interface';

const userSchema = new Schema<IUser>(
  {
   name: { type: String},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  picture: { type: String },
  address: { type: String },
  role: { type: String, enum: ['customer', 'serviceProvider', 'admin'], default: 'customer' },
    isVerified: { type: Boolean, default: false },
  otp: {
    code: { type: String },
    expiresAt: { type: Date },
    verified: { type: Boolean, default: false }
  },
  otpExpires: { type: Date },
}, { timestamps: true });

export const User = model<IUser>("User", userSchema)
