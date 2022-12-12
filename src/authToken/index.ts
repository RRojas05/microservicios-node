import { Request } from 'express-serve-static-core';
import { sign, verify } from 'jsonwebtoken';
import { errorsHandler } from '../utils/errors';
import config from '../utils/config';

class AuthToken {
  public sing = (data: object) => {
    return sign(data, config.jwt.secret);
  };

  public check = (req: Request, owner: string) => {

    const decode = (this.decode(req));

    if (decode.id != owner) {
      throw errorsHandler.errorCode('bad request', 401)
    }
  };

  private get = (auth: string) => {
    if (!auth) {
      throw errorsHandler.errorCode('missing header', 401)
    }

    return auth.replace(/^Bearer\s+/, '');
  };

  private decode = (req: Request) => {
    const autorization = (req.headers['x-access-token'] ||
      req.headers['authorization']) as string;

      const token = this.get(autorization);
    return this.verify(token);
  };

  private verify = (token: string) => {

    interface JwtPayload {
      id: string
    }
    return verify(token, config.jwt.secret) as JwtPayload;
  };
}

export { AuthToken };
