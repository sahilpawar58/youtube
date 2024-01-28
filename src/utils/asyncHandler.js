const asyncHandler = (func) =>{ return (req,res,next) => {
        Promise.resolve(func(req,res,next)).catch((err)=>{next(err)})
}
}

// const asyncHandler = (requestHandler) => {
//     return (req, res, next) => {
//         Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
//     }
// }


export {asyncHandler};
// new Promise((resolve,reject) => (req,res,next) => {
//     if()
// })