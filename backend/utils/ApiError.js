class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.erros = errors

    if(stack){
        this.stack = stack
        Error.captureStack(this,this.constructor)
    }
  } 
}   

export {ApiError}