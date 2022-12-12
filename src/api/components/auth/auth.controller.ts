import bcrypt from 'bcrypt';
import { DBDummy } from '../../store/dummy';
import { SecurityModel } from '../../models/security.model';
import { AuthToken } from '../../../authToken';
import { UserModel } from '../../models/user.model';
import { errorsHandler } from '../../../utils/errors';

let storeDummy = new DBDummy();
let authToken = new AuthToken();

class AuthController {
  TABLE: string = 'auth';
  injectedStore = {};

  constructor(injectedStore: typeof storeDummy | false) {}

  public login = async (email: string, password: string) => {
    const data = await storeDummy.dbQuery(this.TABLE, { email: email });

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
    return storeDummy.authCreate(this.TABLE, auth);
  };
}

export { AuthController };
