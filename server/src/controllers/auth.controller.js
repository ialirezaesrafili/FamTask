import autoBind from "auto-bind";
import authService from "../services/aut.service";

export class AuthController{
    #authService;
    constructor() { 
        autoBind(this);
        this.#authService = authService;
    }
    
    

    async auth(req, res, next) {
        try { 
            const { email, password } = req.body;
            if (!email && !password) {
                return res.status(400).json({
                    status: "error",
                    message: "missign email, or password",
                })
            }

            const auth = await this.#authService.authLogin(email, password);
            if (auth?.error) {
                return res.status(auth?.status).json({
                    message: auth?.error
                })
            }
            return req.status(200).json({
                data: {
                    emal: auth.email,
                    firstname: auth.firstname,
                }
            })

        }
        catch (error) {
            next(error);
        }
    }

} 


const authController = new AuthController();

export default authController;