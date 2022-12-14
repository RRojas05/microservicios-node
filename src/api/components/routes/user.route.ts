import { NextFunction, Request, Response, Router } from 'express';
import {responseNet} from '../../network/response';
import Controller from '../user/index';
import { UserSecure } from '../user/user.secure';
import { UserModel } from '../../models/user.model';

const router = Router();

const getUsers = (req: Request, res: Response, next: NextFunction) => {
  Controller.getUsers()
    .then((list) => {
      responseNet.success(req, res, JSON.stringify(list), 200);
    })
    .catch((err) => {
      responseNet.error(req, res, err.message, 500);
    });
};

const getUserByEmail = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.params;

  Controller.getUser(email)
    .then((user) => {
      if (user) {
        responseNet.success(req, res, JSON.stringify(user), 200);
      } else {
        responseNet.success(req, res, 'User not found', 404);
      }
    })
    .catch(next)
};

const createUser = (req: Request, res: Response, next: NextFunction) => {
  Controller.createUser(req.body)
    .then((user) => {

      console.log(`create user route: ${JSON.stringify(user)}`)
      if (user) {
        responseNet.success(req, res, JSON.stringify(user), 200);
      } else {
        responseNet.error(req, res, 'User already exists', 400);
      }
    })
    .catch(next)
};

const updateUser=(req: Request, res: Response, next: NextFunction)=>{
  const data= req.body
  Controller.updateUser(data)
  .then((state)=>{
    if(state){
      responseNet.success(req, res, 'The user was update successfully', 200);
    }else{
      responseNet.success(req, res, 'User not found', 404);
    }
  })
  .catch(next)
}

const deleteUserByEmail= (req:Request, res: Response, next: NextFunction)=>{

  const {email}= req.params;
  Controller.removeUser(email).then((state)=>{

    if(state){
      responseNet.success(req, res, 'The user was deleted successfully', 200);
    }else{
      responseNet.success(req, res, 'User not found', 404);
    }
  })
  .catch(next)
}

router.get('/', getUsers);
router.get('/:email', getUserByEmail);
router.post('/', createUser);

let userSecure= new UserSecure('update');

// router.put('/:id', userSecure.middlewarwe ,updateUser);
router.put('/:id',updateUser);
router.delete('/:email', deleteUserByEmail);

export default router;
