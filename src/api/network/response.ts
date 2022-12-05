import { Request, Response, NextFunction } from 'express';

class ResponseNet {
  public success(req: Request, res: Response, message: string, status: number) {
    let statusCode : number= status || 200;
    let statusMessage: string = message || '';
    res.status(statusCode).send({
      error: false,
      status: statusCode,
      message: message,
    });
  }

  public error(req: Request, res: Response, message: string, status: number) {

    let statusCode : number= status || 500;
    let statusMessage: string = message || 'Internal server error';

    res.status(status).send({
      error: false,
      status: status,
      message: message,
    });
  }
}

export const responseNet= new ResponseNet();
