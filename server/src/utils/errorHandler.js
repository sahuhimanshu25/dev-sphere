// class ErrorHandler extends Error{
//     constructor(message,statusCode){
//         super(message);
//         this.statusCode=statusCode
        
//         Error.captureStackTrace(this,this.constructor);
//     }
// }

// export default ErrorHandler;
class ErrorHandler extends Error{
    constructor(statusCode,message="SomeThing Went Wrong",stack="",errors=[]){
        super(message);
        this.statusCode=statusCode
        this.data=null
        this.message=message
        this.success=false
        this.errors=errors

        if(stack){
            this.stack=stack;
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}
export {ErrorHandler}