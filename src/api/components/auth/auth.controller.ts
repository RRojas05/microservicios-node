import bcrypt from 'bcrypt';
import { DB } from '../../store/dummy';
import { SecurityModel } from '../../models/security.model';
import { AuthToken } from '../../../authToken';
import { UserModel } from '../../models/user.model';
import { errorsHandler } from '../../../utils/errors';

let store = new DB();
let authToken = new AuthToken();

class AuthController {
  TABLE: string = 'auth';
  injectedStore = {};

  constructor(injectedStore: typeof store | false) {}

  public login = async (email: string, password: string) => {
    const data = await store.dbQuery(this.TABLE, { email: email });

    return bcrypt.compare(password, data.password).then((result)=>{
      if(result){
        const token = authToken.sing(data);
        return token
      }else{
        return false
      }
    })
    .catch((err)=>{
      throw errorsHandler.errorCode(err.message , 500)
    })
  };

  public create = async (data: UserModel) => {

    const cryptPassword= await bcrypt.hash(data.password!, 5)

    const auth: SecurityModel = {
      id: data.id,
      email: data.email,
      password: cryptPassword,
    };
    return store.authCreate(this.TABLE, auth);
  };
}

export { AuthController };
