import {asyncHandler} from "../utils/asyncHandler.js"

// creating method for users registration

const registerUser = asyncHandler( async(req,res) => {
    res.status(200).json({
        message: "yeeeepeeee"
    })
})

export {registerUser}