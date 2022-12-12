import { DBDummy } from '../../store/dummy';
import { db } from '../../store/mysql';
import { authController } from '../auth';
import { UserModel } from '../../models/user.model';
import { v4 as uuidv4 } from 'uuid';
import { querys } from '../../../utils/querys';

let storeMysql = db;
let storeDummy = new DBDummy();

class UserController {
  TABLE: string = 'users';
  injectedStore = {};

  constructor(injectedStore: typeof storeMysql | false) {
    console.log(`injected store: ${JSON.stringify(injectedStore)}`);
  }

  public getUser = async (email: string) => {
    return await storeMysql.getUser(this.TABLE, email);
  };

  public getUsers = async () => {
    return await storeMysql.getUsers(this.TABLE);
  };

  public createUser = async (user: UserModel) => {
    if (!user.id || user.id.length <= 0) {
      user.id = uuidv4();
    }

    authController
      .create(user)
      .then((auth) => {
        if (auth) {
          return auth;
        } else {
          return false;
        }
      })
      .catch((err) => {});

    return await storeMysql.create(this.TABLE, user);
  };

  public updateUser = (user: UserModel) => {
    return storeMysql.updateUser(this.TABLE, user);
  };

  public removeUser = async (email: string) => {
    return storeMysql.removeUser(this.TABLE, email);
  };

  //   const userQuery= querys.deleteByEmail(this.TABLE, email)
  //   return await storeMysql.getRows(userQuery);
  // };

  // public create = async (user: UserModel) => {
  //   if (!user.id || user.id.length <= 0) {
  //     user.id = uuidv4();
  //   }

  //   console.log(`-> ${user.email}`)
  //   const findUser= await this.getUser(user.email)
  //   console.log("🚀 ~ file: user.controller.ts:39 ~ UserController ~ create= ~ findUser", JSON.stringify(findUser))

  //   // if()
  //   // authController
  //   //   .create(user)
  //   //   .then((auth) => {
  //   //     if (auth) {
  //   //       return auth;
  //   //     } else {
  //   //       return false;
  //   //     }
  //   //   })
  //   //   .catch((err) => {});

  //   return storeDummy.userCreate(this.TABLE, user);
  // };

  // public updateUser = (user: UserModel) => {
  //   return storeDummy.updateUser(this.TABLE, user.id, user);
  // };
}

export { UserController };
