import { errorsHandler } from '../../utils/errors';
import { SecurityModel } from '../models/security.model';
import { UserModel } from '../models/user.model';

class DB {
  users: UserModel[] = [];
  auth: SecurityModel[] = [];

  db = {
    users: this.users,
    auth: this.auth,
  };

  public dbQuery = async (tableName: string, params: object) => {
    const col = await this.getTable(tableName);
    const key: string = Object.keys(params)[0];

    return (
      col.filter(
        (userAuth: any) =>
          userAuth[key as keyof typeof this.db.auth] ===
          params[key as keyof typeof params]
      )[0] || false
    );
  };

  public authCreate = async (tableName: string, data: SecurityModel) => {
    let table = await this.getTable(tableName);
    const register = table.find((item: SecurityModel) => item.id === data.id);

    if (register === undefined) {
      table.push(data);
      return data;
    } else {
      return false;
    }
  };

  public userCreate = async (table: string, data: UserModel) => {
    let users = await this.getUsers(table);
    const findUser = users.find((user: UserModel) => user.email === data.email);

    if (findUser === undefined) {
      delete data.password;
      users.push(data);
      return data;
    } else {
      return false;
    }
  };

  public getUsers = async (table: string) => {
    return this.getTable(table);
  };

  public getUserByEmail = async (table: string, email: string) => {
    let users = await this.getUsers(table);
    const findUser = users.find((user: UserModel) => user.email === email);

    if (findUser === undefined) {
      return false;
    } else {
      return findUser;
    }
  };

  public updateUser = (table: string, id: string, data:UserModel) => {
    let users = this.getTable(table);

    const findUser = users.find((user: UserModel) => {});

    try {
      users[users.findIndex((user: UserModel) => user.id === id)] = {
        ...users[users.findIndex((user: UserModel) => user.id === id)],
        ...data,
      };

      return data;
    } catch (err) {
      return err;
    }
  };

  public removeUser = async (table: string, email: string) => {
    let users = await this.getUsers(table);
    const user = users.findIndex((user: UserModel) => user.email === email);

    try {
      if (user != -1) {
        users.splice(user, 1);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      throw errorsHandler.errorCode((err as Error).message, 500)
    }
  };

  private getTable = (table: string) => {
    interface LooseObject {
      [key: string]: any;
    }

    type ObjectKey = keyof typeof this.db;
    const tableKeys = table as ObjectKey;
    let currentTable: LooseObject = this.db[tableKeys];

    return currentTable;
  };
}

export { DB };
