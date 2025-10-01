

import { Router } from "express";
import { UserControllers } from "./user.contoller";
import { checkAuth } from "../../utils/checkAuth";
import { Role } from "./user.interface";

const router = Router()



router.post("/register", UserControllers.createUser)
router.get("/profile",checkAuth(...Object.values(Role)),UserControllers.getMyProfile)


export const UserRoutes = router