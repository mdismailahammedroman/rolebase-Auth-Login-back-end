

import { Router } from "express";
import { AuthController } from "./auth.contoller";

const router = Router()



router.post("/login", AuthController.credentialsLogin)
router.post("/logout", AuthController.logout)
router.post("/forgot-password", AuthController.PasswordResetController)
router.post("/verify-reset-otp", AuthController.verifyResetOTP)
router.post("/change-password", AuthController.resetPassword)

export const AuthRoutes = router