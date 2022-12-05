import { Request, Response, NextFunction } from "express"
import { AuthToken } from "../../../authToken";

let authToken= new AuthToken();

class UserSecure{

  action: string;

  constructor(action:string){
    this.action= action;

  }
  public middlewarwe=(req: Request, res: Response, next: NextFunction)=>{
      switch(this.action){
        case 'update':
          const owner= req.body.id
          authToken.check(req, owner)
          next()
        default:
          next()
      }
  }
}

export {UserSecure}
