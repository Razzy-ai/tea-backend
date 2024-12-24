class ApiResponse{
    constructor(statusCode , data , message = "Success"){
        // overwrite
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }

}