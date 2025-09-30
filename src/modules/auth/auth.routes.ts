

import { Router } from "express";
import { AuthController } from "./auth.contoller";

const router = Router()



router.post("/login", AuthController.credentialsLogin)


export const AuthRoutes = router