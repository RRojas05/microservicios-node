import express, { Application, query } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import auth from './components/routes/auth.route';
import user from './components/routes/user.route';
import { errorsHandler } from '../utils/errors';
import config from '../utils/config';

import { db } from './store/mysql';
export class Server {
  private app: Application;
  private port: string;

  private apiPaths = {
    auth: '/api/auth',
    users: '/api/users',
  };
  private store
  constructor() {
    this.app = express();
    this.port = config.api.port;

    this.middlewares();
    this.routes();
    this.store= db
  }

  private routes = () => {
    this.app.use(this.apiPaths.auth, auth);
    this.app.use(this.apiPaths.users, user);
  };

  private checkDb=async ()=>{
    return await this.store.validateTables()
    .then(result=> {return result})
    .catch(()=>{return false})
  }

  private middlewares = () => {
    this.app.use(morgan('dev'));
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(errorsHandler.errorMessage);
  };

  public listen = async () => {

    if(await this.checkDb()){
      this.app.listen(this.port, () => {
        console.log(`server listen on port ${this.port}`);
      });
    }else{
      console.log(`DB create error, server down`)
    }
  };
}
