import { Router} from "express";
import { loginUser,registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();


const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }])
router.route("/register").post(cpUpload,registerUser);
router.route("/login").post(loginUser);


export default router;