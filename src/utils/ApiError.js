class ApiError extends Error{

    constructor(
        statuscode,
        message= "Something went wrongg",
        errors = [],
        stack = ""

    ){
        // statuscode,message,success  is overwrite here
        super(message)
        this.statuscode = statuscode
        this.data = null
        this.message = message
        // handling api errors not response success code is not overwrite sucess = false will
        this.success = false
        this.errors = errors

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this,this.
                constructor)
        }
    }
}

export {ApiError}