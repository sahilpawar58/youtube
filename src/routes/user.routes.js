import { Router} from "express";
import { 
    loginUser,
    registerUser,
    logoutUser,
    refreshAcessToken,
    resetPassword,
    resetUsername,
    resetavatar,
    getUserChannelProfile,
    getUserHistory } from "../controllers/user.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import {verifyJWT} from '../middlewares/auth.middleware.js'

const router = Router();


const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }])
router.route("/register").post(cpUpload,registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/newtoken").post(refreshAcessToken);
router.route("/resetpassword").post(verifyJWT,resetPassword);
router.route("/resetusername").post(verifyJWT,resetUsername);
router.route("/resetavatar").post(upload.single("avatar"),verifyJWT,resetavatar);
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/history").get(verifyJWT, getUserHistory)


export default router;