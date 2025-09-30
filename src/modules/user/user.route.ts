

import { Router } from "express";
import { UserControllers } from "./user.contoller";
const router = Router()



router.post("/register", UserControllers.createUser)
router.get("/me", authMiddleware, UserControllers.getMyProfile);


export const UserRoutes = router