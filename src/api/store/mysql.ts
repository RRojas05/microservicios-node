import mysql from 'mysql';
import config from '../../utils/config';
import { querys } from '../../utils/querys';
import { UserModel } from '../models/user.model';
class DB {
  constructor() {
    console.log('-> DB constructor');
  }

  private dbconfig = () => {
    return config.mysql;
  };

  private connect = async () => {
    return new Promise<mysql.Connection>((resolve, reject) => {
      const connection = mysql.createConnection(this.dbconfig());

      connection.connect((err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(connection);
      });
    });
  };

  public getUser = async (
    table: string,
    email: string
  ): Promise<UserModel | false> => {
    return new Promise((resolve, reject) => {
      const query = querys.getByEmail(table, email);
      this.connect()
        .then((connection) => {
          connection.query(query, connection, (error, result) => {
            if (error) {
              reject(error);
              return;
            }

            if (result instanceof Array) {
              if (result.length === 0) {
                resolve(false);
              } else {
                resolve(result[0]);
              }
            }
            connection.end();
          });
        })
        .catch((err) => console.log(`DB get user: ${err}`));
    });
  };

  public getUsers = (table: string): Promise<Array<UserModel>> => {
    return new Promise((resolve, reject) => {

      // if(data as UserModel){
      //   console.log('tipo user model')
      // }else{
      //   console.log('tipo security model')
      // }

      const query = querys.getAll(table);
      this.connect()
        .then((connection) => {
          connection.query(query, connection, (error, result) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(result);
            connection.end();
          });
        })
        .catch((err) => console.log(`DB get users: ${err}`));
    });
  };

  public create = async (
    table: string,
    user: UserModel
  ): Promise<UserModel|false> => {
    return new Promise(async (resolve, reject) => {
      const findUser = await this.getUser(table, user.email);

      if (!findUser) {
        const createQuery = querys.createUser(table, user);

        this.connect()
          .then((connection) => {
            connection.query(createQuery, connection, (error, result) => {
              if (error) {
                reject(error);
                return;
              }

              resolve(user);
              connection.end();
            });
          })
          .catch((err) => console.log(`DB create user: ${err}`));
      } else {
        resolve(false);
      }
    });
  };

  public updateUser = async (
    table: string,
    data: UserModel
  ): Promise<UserModel | false> => {
    return new Promise(async (resolve, reject) => {

      const findUser = await this.getUser(table, data.email);
      if (findUser) {
        const query = querys.updateUser(table, { ...findUser, ...data });
        this.connect()
          .then((connection) => {
            connection.query(query, connection, (error, result) => {
              if (error) {
                reject(error);
                return;
              }

              resolve({ ...findUser, ...data });
              connection.end();
            });
          })
          .catch((err) => console.log(`DB update user: ${err}`));
      } else {
        resolve(false);
      }
    });
  };

  public removeUser = async (
    table: string,
    email: string
  ): Promise<true | false> => {
    return new Promise((resolve, reject) => {
      const query = querys.deleteByEmail(table, email);
      this.connect()
        .then((connection) => {
          connection.query(query, connection, (error, result) => {
            if (error) {
              reject(error);
              return;
            }

            if (result.affectedRows === 0) {
              resolve(false);
            } else {
              resolve(true);
            }
            connection.end();
          });
        })
        .catch((err) => console.log(`DB remove user: ${err}`));
    });
  };


  // public authCreate = async (tableName: string, data: SecurityModel) => {
  //   let table = await this.getTable(tableName);
  //   const register = table.find((item: SecurityModel) => item.id === data.id);

  //   if (register === undefined) {
  //     table.push(data);
  //     return data;
  //   } else {
  //     return false;
  //   }
  // };

  public check = (): Promise<true | false> => {
    return new Promise((resolve, reject) => {
      this.connect()
        .then((connection) => {
          connection.query(
            querys.getTables,
            connection,
            async (error, result) => {
              if (error) {
                reject(error);
                return;
              }
              if (result.length === 0) {
                console.log('make tables...');
                const initDB = await this.init();
                resolve(initDB);
              } else {
                console.log('continue...');
                resolve(true);
              }

              connection.end();
            }
          );
        })
        .catch((err) => console.log(`DB check: ${err}`));
    });
  };

  private init = (): Promise<true | false> => {
    return new Promise((resolve, reject) => {
      this.connect()
        .then((connection) => {
          connection.query(querys.createUserTable, (error, result) => {
            if (error) {
              reject(error);
              return false;
            }
          });

          connection.query(querys.createAuthTable, (error, result) => {
            if (error) {
              reject(error);
              return false;
            }
          });

          console.log('DB init success...');
          resolve(true);
          connection.end();
        })
        .catch((err) => console.log(`DB init: ${err}`));
    });
  };
}

export const db = new DB();
