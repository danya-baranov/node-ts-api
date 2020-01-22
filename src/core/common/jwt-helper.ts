import { UserRole } from './../../auth/user.entity';
import { UserModel } from './../../models/user.model';
import Environment from "../../environment";
import * as jsonwebtoken from "jsonwebtoken";

export interface AuthContext {
    id: number;
    fullName: string;
    email: string;
    role: UserRole
}

export interface IRequest extends Request {
    user?: AuthContext;
}

export const authenticate = (user: UserModel) => {
    const authContext: AuthContext = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role

    };
    const token = jsonwebtoken.sign(authContext, Environment.secretJwt as string, {
        expiresIn: Environment.tokenExpiresIn
    });
    return {
        token: token,
        user: authContext,
        expiresIn: Environment.tokenExpiresIn
    };

};

export const verify = (token: string): Promise<AuthContext> => {
    return new Promise((resolve, reject) => {
        jsonwebtoken.verify(token, Environment.secretJwt as string, (err: Error, decoded: any) => {
            if (err) {
                reject(null);
                return;
            }
            resolve(decoded);
        });
    });
};