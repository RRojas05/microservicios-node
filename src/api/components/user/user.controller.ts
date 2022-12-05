import {DB} from '../../store/dummy'
import {mySql} from '../../store/mysql'
import {authController} from '../auth';
import {UserModel} from '../../models/user.model'
import { v4 as uuidv4 } from 'uuid';

let store= new DB();

class UserController{
  TABLE: string= 'users'
  injectedStore={};

  constructor(injectedStore: typeof store| false){
    console.log(`injected store: ${JSON.stringify(injectedStore)}`)
  }

  public getUsers=()=>{

    mySql.conection()
    return store.getUsers(this.TABLE);
  }

  public create= async (user: UserModel)=>{

    if(!user.id ||user.id.length<= 0){
      user.id= uuidv4();
    }

    authController.create(user).then((auth)=>{

      if(auth){
        return auth
      }else{
        return false
      }
    })
    // .catch((err)=>{})
    .catch((err)=>{})

    return store.userCreate(this.TABLE, user)
  }

  public getUser=(email:string)=>{
    return store.getUserByEmail(this.TABLE, email)
  }

  public updateUser=(user: UserModel)=>{
    return store.updateUser(this.TABLE, user.id, user)
  }

  public removeUser=(email: string)=>{
   return store.removeUser(this.TABLE, email)
  }
}

export {UserController};
