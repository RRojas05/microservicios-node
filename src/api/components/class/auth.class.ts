import config from '../../../utils/config';
import { db } from '../../store/mysql';
import { querys } from '../../../utils/querys';
import { SecurityModel } from '../../models/security.model';

class Auth {
  TABLE: string = config.tables.auth;
  constructor() {}

  public getOne = (params: object): Promise<SecurityModel | false> => {
    return new Promise((resolve, reject) => {
      if (Object.entries(params).length > 0) {
        const key: string = Object.keys(params)[0];

        const query = querys.getByField(
          this.TABLE,
          params[key as keyof typeof params],
          key
        );

        db.getOne(query)
          .then((auth) => {
            if (Object.entries(auth).length === 0) {
              resolve(false);
            } else {
              resolve(auth as unknown as SecurityModel);
            }
          })
          .catch((err) => {
            console.log(`auth get one error ${err}`);
            reject(err);
          });
      } else {
        reject(false);
      }
    });
  };

  public create = (auth: SecurityModel): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const query = querys.createAuth(this.TABLE, auth);

      db.editRow(query)
        .then((result) => {
          if (result.affectedRows === 1) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((err) => {
          console.log(`auth create error ${err}`);
          reject(false);
        });
    });
  };

  public update = () => {
    return new Promise((resolve, reject) => {});
  };

  public delete = () => {
    return new Promise((resolve, reject) => {});
  };

  public login = () => {
    return new Promise((resolve, reject) => {});
  };
}
export const authClass = new Auth();
