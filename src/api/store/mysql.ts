import mysql from 'mysql';
import config from '../../utils/config';
import { querys } from '../../utils/querys';
import { SecurityModel, SecurityTables } from '../models/security.model';
import { UserModel } from '../models/user.model';

interface mysqlResult {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  serverStatus: number;
  warningCount: number;
  message: string;
  protocol41: boolean;
  changedRows: number;
}

class DB {
  dbPool: mysql.Pool;
  constructor() {
    this.dbPool = mysql.createPool(this.dbconfig());
  }

  private dbconfig = () => {
    return config.mysql;
  };

  public attemptConnection = (query: string) => {
    return new Promise<Array<any>>((resolve, reject) => {
      this.dbPool.getConnection((err, connection) => {
        if (err) {
          setTimeout(this.attemptConnection, 2000);
        } else {
          connection.query(query, (errQuery, results) => {
            connection.release();

            if (errQuery) {
              reject(errQuery);
            } else {
              resolve(results);
            }
          });
        }
      });
    });
  };

  public validateTables = async (): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      await this.attemptConnection(querys.getTables)
        .then((results) => {
          if (results.length === 0) {
            console.log(`-> DB construct`);
            this.createTables()
              .then((result) => resolve(result))
              .catch(() => {
                reject(false);
              });
          } else {
            console.log(`DB continue...`);
            resolve(true);
          }
        })
        .catch((err) => {
          reject(false)
          console.log(`DB validate promise: ${err}`)
        });
    });
  };

  private createTables = async (): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      let tablesSuccess: boolean = true;
      const querysStack: Array<string> = [
        querys.createUserTable,
        querys.createAuthTable,
        querys.createUserFollowTable,
        querys.createIndexs,
      ];

      for (const query of querysStack) {
        await this.attemptConnection(query).catch((err) => {
          tablesSuccess = false;
          reject(false);
        });
      }
      console.log(`DB construction success...`);
      resolve(tablesSuccess);
    });
  };

  public getUser = async (
    table: string,
    email: string
  ): Promise<Array<UserModel>> => {
    return new Promise((resolve, reject) => {
      const query = querys.getByEmail(table, email);

      this.attemptConnection(query)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.log(`DB get user: ${err}`);
          reject(false);
        });
    });
  };

  public createUser = async (
    table: string,
    user: UserModel
  ): Promise<UserModel | boolean> => {
    return new Promise(async (resolve, reject) => {
      const findUser = await this.getUser(table, user.email);

      if (!findUser.length) {
        const query = querys.createUser(table, user);
        this.attemptConnection(query).then((result) => {
          if (result) {
            resolve(user);
          }
        });
      } else {
        resolve(false);
      }
    });
  };

  public authCreate = async (
    table: string,
    data: SecurityModel
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const query = querys.createAuth(table, data);

      this.attemptConnection(query)
        .then((result) => {
          if (result) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((err) =>{
          console.log(`DB auth create: ${err}`)
          reject(false)
        });
    });
  };

  public getUsers = (table: string): Promise<Array<UserModel>> => {
    return new Promise((resolve, reject) => {
      const query = querys.getAll(table);
      this.attemptConnection(query)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(false);
          console.log(`DB get users: ${err}`);
        });
    });
  };

  public removeUser = async (
    table: string,
    email: string
  ): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      const findUser = await this.getUser(table, email);
      if (!findUser.length) {
        resolve(false);
      } else {
        const query = querys.delete(table, findUser[0].id);

        this.attemptConnection(query)
          .then((result) => {
            resolve(true);

            const myResult = result as unknown as mysqlResult;
            if (myResult.affectedRows === 1) {
              resolve(true);
            } else {
              resolve(false);
            }
          })
          .catch((err) => {
            reject(false);
            console.log(`DB remove users err: ${err}`);
          });
      }
    });
  };

  public updateUser = async (
    table: string,
    data: UserModel
  ): Promise<UserModel | false> => {
    return new Promise(async (resolve, reject) => {
      console.log(`update data ${JSON.stringify(data)}`);

      const findUser = await this.getUser(table, data.email);

      if (!findUser.length) {
        resolve(false);
      } else {
        const query = querys.updateUser(table, { ...findUser[0], ...data });
        this.attemptConnection(query)
          .then((result) => {

            const myResult = result as unknown as mysqlResult;
            if (myResult.affectedRows === 1) {
              resolve({ ...findUser, ...data });
            } else {
              resolve(false);
            }
          })
          .catch((err) => {
            reject(false);
            console.log(`DB update users err: ${err}`);
          });
      }
    });
  };
}

export const db = new DB();
