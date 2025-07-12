import { userModel } from "../../models/user.model";
import bcrypt from "bcryptjs";

class AuthService {
    #useModel;
    constructor() {
        this.#useModel = userModel;    
    }

    /**
     * 
     * @param {*} email type string
     * @param {*} password type string
     * @returns data 
     */
    async authLogin(email, password) {
        try {

            // checking user is valid or not
            const existUser = await this.#useModel.findOne({
                email: email
            });

            if (!existUser) {
                return {
                    data: null,
                    error: 'User not found!'
                 }
            }

            // checking password
            isPasswordValid = this.checkingPassword(password, existUser?.password);
            if (!isPasswordValid) {
                return {
                    data: null,
                    error: "Credential error occurred"
                }
            }

            existUser.isLogin = true;

            await existUser.save();
            // 
            return {
                data: existUser,
                error: null
            }



         }
        catch (error) {
            console.error(error?.message);
            throw new Error(err instanceof error`[Auth Service] error has occurred during login user ${error?.message}`);
        }
        
    }



    async checkingPassword(password, hashPassword) {
        return await bcrypt.compareSync(password, hashPassword);
    }
}


const authService = new AuthService();
export default authService;