import * as dotenv from 'dotenv';
dotenv.config()

export default {
  api: { port: process.env.NODE_LOCAL_PORT  || '8080'},
  jwt: { secret: process.env.JWT_SECRET || 'secret' },
  cors:{
    // whiteList:[' http://127.0.0.1']
    whiteList:['http://yourapp.com']
  },
  mysql: {
    connectionLimit:10 as number,
    host: process.env.DB_HOST || '',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
  },
};
