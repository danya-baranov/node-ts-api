import { Request, Response, Application } from 'express';
import * as bookRouter from './books/book.router'
import * as authRouter from './auth/auth.router'
import { AuthMiddleware } from './core/middlewares/auth.middleware';

export const connect = (app: Application) => {
    app.route("/").get((_req: Request, res: Response) => {
        res.status(200).send({
            message: `API Worked!`
        });
    });
    app.use("/auth", authRouter.itemsRouter)
    app.use("/books", bookRouter.itemsRouter)

}