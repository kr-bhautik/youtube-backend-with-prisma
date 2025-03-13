import { userInteface } from "./models/user.model"
declare global {
    namespace Express {
        interface Request{
            userInfo? : userInteface
        }
    }
}
export {}