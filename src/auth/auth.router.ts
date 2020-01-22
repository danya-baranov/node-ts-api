import { Router, NextFunction, Response, Request } from 'express';
import { check, validationResult, ValidationError, Result } from 'express-validator';
import { User, UserModel } from '../models/user.model';
import * as HashEncrypter from '../core/common/hash-encrypter'
import { HttpException } from '../core/common/http-exception';
import * as JwtHelper from "../core/common/jwt-helper";
import { UserRole } from './user.entity';
import { IRegister } from '../shared/interfaces/register.interface';
import { ILogin } from '../shared/interfaces/login.interface';
import { STATUS, MESSAGE } from '../shared/constants/bookApi.constants';

export const itemsRouter = Router()

const routes = {
    register: "/register",
    login: "/login"
}
const validationFields = {
    email: 'email',
    password: 'password',
    fullName: 'fullName'
}
const validationMessages = {
    wrongEmail: 'Wrong email',
    wrongPassword: 'short password(min 6)',
    wrongFullName: 'Input name'

}


itemsRouter.post(
    routes.register,
    [
        check(validationFields.email, validationMessages.wrongEmail).isEmail(),
        check(validationFields.password, validationMessages.wrongPassword).isLength({ min: 6 }),
        check(validationFields.fullName, validationMessages.wrongFullName).exists()
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        try {

            const errors: Result<ValidationError> = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(STATUS.BAD_REQUEST).json({
                    errors: errors.array(),
                    message: MESSAGE.INCORRECT_DATA
                })
            }

            const { email, password, fullName }: IRegister = { ...req.body }

            const existedUser = await User.findOne({ email })
            if (existedUser) {
                throw new HttpException([MESSAGE.USER_ALREADY_EXIST]);
            }

            const hashedPassword = await HashEncrypter.getHash(password)


            const user: UserModel = new User({
                email,
                password: hashedPassword,
                fullName,
                role: UserRole.Client
            })
            await user.save()
            const authContext = JwtHelper.authenticate(user);
            return res.send(authContext);


        } catch (e) {
            next(e)
        }
    }
)

itemsRouter.post(
    routes.login,
    [
        check(validationFields.email, validationMessages.wrongEmail).isEmail(),
        check(validationFields.password, validationMessages.wrongPassword).isLength({ min: 6 }),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        try {

            const errors: Result<ValidationError> = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(STATUS.BAD_REQUEST).json({
                    errors: errors.array(),
                    message: MESSAGE.INCORRECT_DATA
                })
            }

            const { email, password }: ILogin = req.body

            const user = await User.findOne({ email })
            if (!user) {
                throw new HttpException([MESSAGE.INVALIDE_CREDENTIALS]);

            }
            const isMatch = await HashEncrypter.comparePasswords(password, user.password)
            if (!isMatch) {
                throw new HttpException([MESSAGE.INVALIDE_CREDENTIALS]);
            }

            const authContext = JwtHelper.authenticate(user);
            return res.send(authContext);

        } catch (e) {
            next(e);
        }
    }
)