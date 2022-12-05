import { Request, Response, NextFunction } from 'express';
import { responseNet } from '../api/network/response';

interface Error {
  message: string;
  status?: number;
}

class ErrorsHandler {

  public errorMessage(err: Error, req: Request, res: Response, next: NextFunction) {
    const message = err.message || 'internal error';
    const status = err.status || 500;

    responseNet.error(req, res, message, status);
  }

  public errorCode=(message: string, code: number)=>{
    let error= new Error(message) as Error

    if(code){
      error.status= code
    }

    return error;
  }
}

export const errorsHandler= new ErrorsHandler()
