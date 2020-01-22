import { STATUS } from '../../shared/constants/bookApi.constants';
import { Response, NextFunction } from "express";
import { UserRole } from "../../auth/user.entity";
import * as JwtHelper from "../common/jwt-helper";
import { IRequest } from "../common/jwt-helper";

export const AuthMiddleware = (permissions: UserRole[]): any => {


    const errorMessages = {
        failed: "Failed to authenticate token.",
        noToken: "No token provided.",
        noPermissions: "You don't have such permissions!",
    }

    return async (req: IRequest, res: Response, next: NextFunction) => {
        try {
            var token = req.headers.get("x-access-token");
            if (!token) {
                return res
                    .status(STATUS.BAD_REQUEST)
                    .send({ auth: false, message: errorMessages.noToken });
            }
            const authContext = await JwtHelper.verify(token);
            if (!authContext) {
                return res
                    .status(STATUS.BAD_REQUEST)
                    .send({ auth: false, message: errorMessages.failed });
            }
            if (
                permissions.length !== 0 &&
                permissions.filter(p => p === authContext.role).length === 0
            ) {
                return res
                    .status(STATUS.BAD_REQUEST)
                    .send({ auth: false, message: errorMessages.noPermissions });
            }
            req["user"] = authContext;
            next();
        } catch (e) {
            return res
                .status(STATUS.BAD_REQUEST)
                .send({ auth: false, message: errorMessages.failed });
        }
    };
};
