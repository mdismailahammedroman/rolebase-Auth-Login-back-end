

import { Router } from "express";
import { UserControllers } from "./user.contoller";
const router = Router()



router.post("/register", UserControllers.createUser)

export const UserRoutes = router