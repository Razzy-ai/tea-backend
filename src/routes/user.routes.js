import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/register").post(
    
    // middleware injected
    upload.fields([
        {
            // in frontend name of the field should be avatar only
           name:"avatar",
           maxCount:1
          //  cnt of the file
        },
        {
           name:"coverImage",
           maxCount:1

        }
    ]),
    registerUser
)

export default router