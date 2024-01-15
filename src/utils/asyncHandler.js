const asyncHandler = (func) => (req,res,next) => {
        return new Promise((resolve,reject) => {
            func(req,res,next);
        })
        .then(() => {
            // next(req,re);
            resolve();
        })
        .catch((err) => {
            res.status(err.code || 500).json({
                success:true,
                message:err.message
            })
            reject(err);
        })
}

// new Promise((resolve,reject) => (req,res,next) => {
//     if()
// })