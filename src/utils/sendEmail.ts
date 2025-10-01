/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from 'nodemailer';
import AppError from "../errorHelpers/AppError";
import { envVars } from "../config/envVars";
import { StatusCodes } from 'http-status-codes';


interface SendEmailOptions {
  to: string;
  subject: string;
  htmlBody: string;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}


const transporter = nodemailer.createTransport({
  secure: true,
  auth: {
    user: envVars.SMTP_USER,
    pass: envVars.SMTP_PASS,
  },
  port: Number(envVars.SMTP_PORT),
  host: envVars.SMTP_HOST,
});

export const sendEmail = async (email: string, otp: string, {
    to, subject, htmlBody, attachments,
}: SendEmailOptions) => {
  try {
    const info = await transporter.sendMail({
      from: envVars.SMTP_FROM,
      to,
      subject,
      html: htmlBody,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });

    console.log(`✉️ Email sent to ${to}: ${info.messageId}`);
  } catch (error: any) {
  console.error("Full Error:", error);
    throw new AppError(StatusCodes.UNAUTHORIZED, "Email error");
  }
};
