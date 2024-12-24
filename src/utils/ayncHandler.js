const asyncHandler = (requestHandler) => {
    (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).
        catch((err) => next(err))
    }
}



export {asyncHandler}






// Async is powerful can pass parameters
// const asyncHandler = () => {}
// const asyncHandler = (func) => { async() => {} }
// // just brackets remove
// const asyncHandler = (func) =>  async() => {} 



    // req,res,next extracted from fn
// const asyncHandler = (fn) =>  async(req,res,next) => {
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success:false,
//             message: error.message
//         })
//     }
// } 

