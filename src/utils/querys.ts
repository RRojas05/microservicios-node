import { SecurityModel } from '../api/models/security.model';
import { UserModel } from '../api/models/user.model';
import config from './config';

class Querys {
  getTables: string;
  createUserTable: string;
  createAuthTable: string;
  createUserFollowTable: string
  createIndexs: string
  constructor() {
    this.getTables = `SHOW TABLES`;
    this.createUserTable =
    `CREATE TABLE ${config.tables.users} (
      id varchar(36) NOT NULL,
      email varchar(30) NOT NULL,
      name varchar(100) NOT NULL,
      user_name varchar(100) NOT NULL,
      age SMALLINT NOT NULL,
      CONSTRAINT users_PK PRIMARY KEY (id)
    );
    `

    this.createAuthTable =
    `CREATE TABLE ${config.tables.auth} (
      id VARCHAR(36) NOT NULL,
      password VARCHAR(100) NOT NULL,
      CONSTRAINT auth_FK FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
    )
    ENGINE=InnoDB
    DEFAULT CHARSET=latin1
    COLLATE=latin1_swedish_ci`

    this.createUserFollowTable=
    `CREATE TABLE ${config.tables.follow} (
      user_from varchar(36) NULL,
      user_to varchar(36) NULL
    )
    ENGINE=InnoDB
    DEFAULT CHARSET=latin1
    COLLATE=latin1_swedish_ci`

    this.createIndexs= `CREATE INDEX user_follow_user_from_IDX USING BTREE ON ${config.tables.follow} (user_from,user_to)`
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

  public delete = (table: string, email: string) => {
    return `DELETE FROM ${table} WHERE id= '${email}' LIMIT 1`;
  };

  public createUser(table: string, data: UserModel) {
      return `INSERT INTO ${table} (id, name, user_name, email, age)
      VALUES ('${data.id}', '${data.name}', '${data.user_name}', '${data.email}', '${data.age}')`;
  }

  public updateUser(table: string, data:UserModel){
    return `UPDATE ${table} SET name= '${data.name}', age= '${data.age}', user_name= '${data.user_name}' WHERE email= '${data.email}'`
  }

  public createAuth(table: string, data: SecurityModel) {
    return `INSERT INTO ${table} (id, password)
    VALUES ('${data.id}', '${data.password}')`;
}
}

export const querys = new Querys();
