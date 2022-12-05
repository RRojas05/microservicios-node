import express, { Application } from 'express';
import config from '../config';
import morgan from 'morgan';
import cors from 'cors';
import auth from './components/routes/auth.route';
import user from './components/routes/user.route';
import { errorsHandler } from '../utils/errors';

export class Server {
  private app: Application;
  private port: string;

  private apiPaths = {
    auth: '/api/auth',
    users: '/api/users',
  };
  constructor() {
    this.app = express();
    this.port = config.api.port;

    this.middlewares();
    this.routes();
  }

  private routes = () => {
    this.app.use(this.apiPaths.auth, auth);
    this.app.use(this.apiPaths.users, user);
  };

  private middlewares = () => {
    // const corsOptions = {
    //   origin: function (origin, callback) {
    //     if (config.cors.whiteList.indexOf(origin) !== -1) {
    //       callback(null, true)
    //     } else {
    //       callback(new Error('Not allowed by CORS'))
    //     }
    //   }
    // }

    this.app.use(morgan('dev'));
    this.app.use(express.json());
    // this.app.use(cors({
    //   origin: config.cors.whiteList,
    //   credentials: true,
    //   methods:['POST']
    // }));

    this.app.use(
      cors({
        origin: function (origin, callback) {
          // allow requests with no origin
          // (like mobile apps or curl requests)
          if (!origin) {

            console.log('-> if')
            return callback(null, true);
          } else {
            console.log('-> else')
          }
          if (config.cors.whiteList.indexOf(origin) === -1) {
            var msg =
              'The CORS policy for this site does not ' +
              'allow access from the specified Origin.';

            console.log('The CORS policy for this site does not');
            return callback(new Error(msg), false);
          }
          console.log('cors NEXT');
          return callback(null, true);
        },
      })
    );
    // this.app.use(cors)
    this.app.use(errorsHandler.errorMessage);
  };

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`server listen on port ${this.port}`);
    });
  }
}
