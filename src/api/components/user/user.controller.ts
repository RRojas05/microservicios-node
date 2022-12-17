import { DBDummy } from '../../store/dummy';
import { db } from '../../store/mysql';
import { authController } from '../auth';
import { UserModel } from '../../models/user.model';
import { v4 as uuidv4 } from 'uuid';
import { querys } from '../../../utils/querys';
import config from '../../../utils/config';

let storeMysql = db;
let storeDummy = new DBDummy();

class UserController {
  TABLE: string = config.tables.users;
  AUTH_TABLE: string =config.tables.auth

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

  public createUser = async (user: UserModel): Promise<UserModel | boolean> => {
    return new Promise((resolve, reject) => {
      if (!user.id || user.id.length <= 0) {
        user.id = uuidv4();
      }

      storeMysql
        .createUser(this.TABLE, user)
        .then(async (result) => {
          if (result !== false) {
            authController
              .create(user)
              .then((result) => {
                if (result) {
                  delete user.password;
                  resolve(user);
                }
              })
              .catch((err) => {
                console.log(`create auth err: ${err}`);
                reject(false);
              });
          } else {
            resolve(false);
          }
        })
        .catch((err) => {
          console.log(`create user err: ${err}`);
          reject(false);
        });
    });
  };

  public updateUser = (user: UserModel) => {
    return storeMysql.updateUser(this.TABLE, user);
  };

  public removeUser = async (email: string) => {
    return storeMysql.removeUser(this.TABLE, email);
  };
}

export { UserController };
