import bcrypt from 'bcrypt';

import { db } from '../../store/mysql';
import { SecurityModel } from '../../models/security.model';
import { AuthToken } from '../../../authToken';
import { UserModel } from '../../models/user.model';
import { errorsHandler } from '../../../utils/errors';
import { authClass } from '../class/auth.class';
import { userClass } from '../class/user.class';
import config from '../../../utils/config';

let authToken = new AuthToken();

class AuthController {
  TABLE: string = config.tables.auth;
  TABLE_USERS = config.tables.users;
  injectedStore = {};

  constructor(injectedStore: false) {}

  public login = async (
    email: string,
    password: string
  ): Promise<string | false> => {
    return new Promise(async (resolve, reject) => {
      const user = await userClass.getOne({ email: email });

      if (user) {
        const auth = await authClass.getOne({ id: user.id });

        if (auth) {
          await bcrypt
            .compare(password, auth.password)
            .then((result) => {
              if (result) {
                resolve(
                  authToken.sing({
                    id: user.id,
                    email: user.email,
                  })
                );
              } else {
                reject(false);
              }
            })
            .catch((err) => {
              throw errorsHandler.errorCode(err.message, 500);
            });
        } else {
          resolve(false);
        }
      } else {
        resolve(false);
      }
    });
  };

  public create = async (data: UserModel): Promise<boolean> => {
    const cryptPassword = await bcrypt.hash(data.password!, 5);

    const auth: SecurityModel = {
      id: data.id,
      password: cryptPassword,
    };
    return await authClass.create(auth);
  };
}

export { AuthController };
