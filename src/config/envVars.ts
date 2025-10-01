import dotenv from "dotenv";

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "Development" | "Production";
  BCRYPT_SALT_ROUND: string;
  JWT_SECRET: string;
  JWT_EXPIRED: string;
  SMTP_HOST: string;
  SMTP_PORT: string;
  SMTP_USER: string;
  SMTP_PASS: string;
  SMTP_FROM: string;
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariable: string[] = [
    "PORT",
    "DB_URL",
    "NODE_ENV",
    "BCRYPT_SALT_ROUND",
    "JWT_SECRET",
    "JWT_EXPIRED",
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASS",
    "SMTP_FROM",
  ];
  requiredEnvVariable.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing require envroment variable ${key}`);
    }
  });
  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
    NODE_ENV: process.env.NODE_ENV as "Development" | "Production",
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
    JWT_EXPIRED: process.env.JWT_EXPIRED as string,
    SMTP_HOST: process.env.SMTP_HOST as string,
    SMTP_PORT: process.env.SMTP_PORT as string,
    SMTP_USER: process.env.SMTP_USER as string,
    SMTP_PASS: process.env.SMTP_PASS as string,
    SMTP_FROM: process.env.SMTP_FROM as string,
  };
};

dotenv.config();
export const envVars = loadEnvVariables();
