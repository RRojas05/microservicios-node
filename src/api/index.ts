// import express from 'express';
// import morgan from 'morgan';
// import config from '../config';
// import auth from './components/routes/auth.route';
// import user from './components/routes/user.route';
// import { errorsHandler } from '../utils/errors';

// const app = express();

// app.use(morgan('dev'))
// app.use(express.json())
// app.use('/api/auth', auth);
// app.use('/api/users', user);
// app.use(errorsHandler.errorMessage);

// app.listen(config.api.port, () => {
//   console.log(`port: ${config.api.port}`)
// });

import dotenv from 'dotenv'
import { Server } from "./server";

dotenv.config()

const server= new Server()
server.listen()
