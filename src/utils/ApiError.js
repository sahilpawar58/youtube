class ApiError extends Error{
    constructor(
        message="Something went wrong!!",
        statusCode,
        errors=[],
        success,
        stack=null
    ){
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.data = null;
        this.errors = errors;
        this.success = success;

        if(stack != null){
            this.stack = Error.captureStackTrace(this,this.constructor);
        }else{
            this.stack = stack;
        }
        
    }
}

export {ApiError};