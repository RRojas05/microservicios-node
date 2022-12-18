import mysql from 'mysql';
import config from '../../utils/config';
import { querys } from '../../utils/querys';
import { SecurityModel } from '../models/security.model';
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

  public editRow = (query: string): Promise<mysqlResult> => {
    return new Promise((resolve, reject) => {
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

  public getOne = (query: string): Promise<UserModel | SecurityModel> => {
    return new Promise((resolve, reject) => {
      this.dbPool.getConnection((err, connection) => {
        if (err) {
          setTimeout(this.attemptConnection, 2000);
        } else {
          connection.query(query, (errQuery, results) => {
            connection.release();

            if (errQuery) {
              reject(errQuery);
            } else {
              if(results.length> 0){
                resolve(results[0]);
              }else(
                resolve(results)
              )
            }
          });
        }
      });
    });
  };

  public getAll = (
    query: string
  ): Promise<Array<UserModel | SecurityModel>> => {
    return new Promise((resolve, reject) => {
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

  public getByField = async (
    table: string,
    param: string,
    field: string
  ): Promise<Array<UserModel | string> | SecurityModel> => {
    return new Promise((resolve, reject) => {
      const query = querys.getByField(table, param, field);

      this.attemptConnection(query)
        .then((result) => {
          if (table === config.tables.users) {
            resolve(result as unknown as UserModel[]);
          } else if (table === config.tables.auth) {
            result as unknown as SecurityModel;
            resolve(result as unknown as SecurityModel);
          }
        })
        .catch((err) => {
          console.log(`DB get by field: ${err}`);
          reject(false);
        });
    });
  };

  private attemptConnection = (query: string) => {
    return new Promise<Array<UserModel> | SecurityModel | mysqlResult>(
      (resolve, reject) => {
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
      }
    );
  };

  public validateTables = async (): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      await this.attemptConnection(querys.getTables)
        .then((results) => {
          if (results) {
            const tablesResult = results as unknown as Array<string>;

            if (tablesResult.length === 0) {
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
          }
        })
        .catch((err) => {
          reject(false);
          console.log(`DB validate promise: ${err}`);
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
}

export const db = new DB();
