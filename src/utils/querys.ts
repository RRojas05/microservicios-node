import { SecurityModel } from '../api/models/security.model';
import { UserModel } from '../api/models/user.model';

class Querys {
  getTables: string;
  createUserTable: string;
  createAuthTable: string;
  // getTableRegister: string
  constructor() {
    this.getTables = `SHOW TABLES;`;
    this.createUserTable = `CREATE TABLE IF NOT EXISTS users(
      id CHAR(36) PRIMARY KEY,
      name varchar(100) NULL,
      email varchar(30) NOT NULL,
      age SMALLINT(100) NOT NULL,
      password varchar(100) NOT NULL)`;

    this.createAuthTable = `CREATE TABLE IF NOT EXISTS auth(
      id CHAR(36) PRIMARY KEY,
      email varchar(30) NOT NULL,
      password varchar(100) NOT NULL
    )`;
  }

  public getAll = (table: string) => {
    return `SELECT * FROM ${table}`;
  };

  public getById = (table: string, id: string) => {
    return `SELECT * FROM ${table} WHERE id= '${id}'`;
  };

  public getByEmail = (table: string, email: string) => {
    return `SELECT * FROM ${table} WHERE email= '${email}'`;
  };

  public deleteByEmail = (table: string, email: string) => {
    return `DELETE FROM ${table} WHERE email= '${email}' LIMIT 1`;
  };

  public createUser(table: string, data: UserModel) {
      return `INSERT INTO ${table} (id, name, email, age, password)
      VALUES ('${data.id}', '${data.name}', '${data.email}', '${data.age}', '${data.password}')`;
  }

  public updateUser(table: string, data:UserModel){
    console.log(`query user ${JSON.stringify(data)}`)
    return `UPDATE ${table} SET name= '${data.name}', age= '${data.age}', password= '${data.password}' WHERE email= '${data.email}'`
  }
}

export const querys = new Querys();
