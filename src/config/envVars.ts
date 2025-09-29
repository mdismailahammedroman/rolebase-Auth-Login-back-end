import dotenv from 'dotenv';

interface EnvConfig{
    PORT:string,
    DB_URL:string,
    NODE_ENV:"Development"| "Production",
}

 const loadEnvVariables=():EnvConfig=>{
    const requiredEnvVariable:string[]=["PORT","DB_URL","NODE_ENV"]
    requiredEnvVariable.forEach(key=>{
        if (!process.env[key]) {
            throw new Error( `Missing require envroment variable ${key}`)
        }
    })
    return { 
    PORT:process.env.PORT as string,
    DB_URL:process.env.DB_URL as string,
    NODE_ENV:process.env.NODE_ENV as "Development"| "Production",
}
    
 }

dotenv.config()
export const envVars=loadEnvVariables()