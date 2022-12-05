import { NextFunction, Request, Response, Router } from 'express';
import {responseNet} from '../../network/response';
import {authController} from '../auth/index';

const router = Router();


const login=(req: Request, res: Response)=>{
  const {email, password} =req.body

  authController.login(email, password).then((token)=>{
    if(token){
      responseNet.success(req, res, JSON.stringify(token), 200);
    }else{
      responseNet.success(req, res, 'User not found', 404);
    }
  }).catch((err)=>{
    responseNet.error(req, res, err.message, 500);
  })
}

router.post('/login', login);

export default router;
