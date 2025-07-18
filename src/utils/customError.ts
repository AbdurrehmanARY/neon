export class CustomError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    // this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';

    // this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// export class CustomError extends Error {
//   statusCode: number;
//   status: 'fail' | 'error';
//   isOperational: boolean;

//   constructor(message: string, statusCode: number) {
//     super(message);

//     this.statusCode = statusCode;
//     this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
//     this.isOperational = true;

//     Error.captureStackTrace(this, this.constructor);
//   }
// }
