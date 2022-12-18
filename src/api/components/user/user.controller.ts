import { DBDummy } from '../../store/dummy';
import { db } from '../../store/mysql';
import { authController } from '../auth';
import { UserModel } from '../../models/user.model';
import { v4 as uuidv4 } from 'uuid';
import { querys } from '../../../utils/querys';
import config from '../../../utils/config';

import { userClass } from '../class/user.class';

let storeMysql = db;
let storeDummy = new DBDummy();

class UserController {
  TABLE: string = config.tables.users;
  AUTH_TABLE: string = config.tables.auth;

  injectedStore = {};

  constructor(injectedStore: typeof storeMysql | false) {
    console.log(`injected store: ${JSON.stringify(injectedStore)}`);
  }

  public getUser = async (email: string) => {
    return await userClass.getOne({ email: email });
  };

  public getUsers = async () => {
    return await userClass.getAll();
  };

  public createUser = async (data: UserModel): Promise<UserModel | boolean> => {
    return new Promise(async (resolve, reject) => {
      if (!data.id || data.id.length <= 0) {
        data.id = uuidv4();
      }

      const user = await userClass.create(data);
      if (!user) {
        resolve(false);
      } else {
        const auth = await authController.create(data);
        if (!auth) {
          resolve(false);
        } else {
          resolve(user);
        }
      }
    });
  };

  public updateUser = (user: UserModel) => {
    return userClass.update(user);
  };

  public removeUser = async (email: string) => {
    return userClass.delete({email: email})
  };
}

export { UserController };
