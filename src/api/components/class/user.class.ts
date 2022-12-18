import config from '../../../utils/config';
import { db } from '../../store/mysql';
import { querys } from '../../../utils/querys';
import { UserModel } from '../../models/user.model';

class User {
  TABLE: string = config.tables.users;
  constructor() {}

  public getOne = (params: object): Promise<UserModel | false> => {
    return new Promise((resolve, reject) => {
      if (Object.entries(params).length > 0) {
        const key: string = Object.keys(params)[0];

        const query = querys.getByField(
          this.TABLE,
          params[key as keyof typeof params],
          key
        );

        db.getOne(query)
          .then((user) => {
            if (Object.entries(user).length === 0) {
              resolve(false);
            } else {
              resolve(user as unknown as UserModel);
            }
          })
          .catch((err) => {
            console.log(`user get one error: ${JSON.stringify(err)}`);
            reject(false);
          });
      } else {
        reject(false);
      }
    });
  };

  public getAll = (): Promise<Array<UserModel>> => {
    return new Promise((resolve, reject) => {
      const query = querys.getAll(this.TABLE);

      db.getAll(query)
        .then((users) => {
          if (Array.isArray(users)) {
            resolve(users as unknown as Array<UserModel>);
          } else {
            reject(false);
          }
        })
        .catch((err) => {
          console.log(`user get all error: ${JSON.stringify(err)}`);
          reject(false);
        });
    });
  };

  public create = (data: UserModel): Promise<UserModel | false> => {
    return new Promise(async (resolve, reject) => {
      const getUser = await this.getOne({ email: data.email });

      if (!getUser) {
        const query = querys.createUser(this.TABLE, data);

        db.editRow(query)
          .then((result) => {
            if (result.affectedRows === 1) {
              resolve(data);
            } else {
              resolve(false);
            }
          })
          .catch((err) => {
            console.log(`user create error: ${JSON.stringify(err)}`);
            reject(false);
          });
      } else {
        resolve(false);
      }
    });
  };

  public update = (user: UserModel): Promise<UserModel | false> => {
    return new Promise(async (resolve, reject) => {
      const getUser = await this.getOne({ email: user.email });

      if (!getUser) {
        resolve(false);
      } else {
        const query = querys.updateUser(this.TABLE, { ...getUser, ...user });

        db.editRow(query)
          .then((result) => {
            if (result.affectedRows === 1) {
              resolve({ ...getUser, ...user });
            } else {
              resolve(false);
            }
          })
          .catch((err) => {
            console.log(`user udpate error: ${JSON.stringify(err)}`);
            reject(false);
          });
      }
    });
  };

  public delete = (params: object): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      const getUser = await this.getOne(params);

      if (!getUser) {
        resolve(false);
      } else {
        if (Object.entries(params).length > 0) {
          const key: string = Object.keys(params)[0];

          const query = querys.delete(
            this.TABLE,
            params[key as keyof typeof params],
            key
          );

          db.editRow(query)
            .then((result) => {
              if (result.affectedRows === 1) {
                resolve(true);
              } else {
                resolve(false);
              }
            })
            .catch((err) => {
              console.log(`auth delete error ${err}`);
              reject(false);
            });
        } else {
          reject(false);
        }
      }
    });
  };
}
export const userClass = new User();
