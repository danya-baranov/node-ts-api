import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'
import mongoose from 'mongoose'
import { connect } from "./routes";
import Environment from './environment';
import * as dotenv from "dotenv";
dotenv.config();

class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.setConfig();
        this.setMongoConfig();
        connect(this.app)
    }

    private setConfig() {
        //Allows us to receive requests with data in json format
        this.app.use(bodyParser.json({ limit: '50mb' }));
        //Allows us to receive requests with data in x-www-form-urlencoded format
        this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
        //Enables cors   
        this.app.use(cors());

    }

    private setMongoConfig() {
        mongoose.Promise = global.Promise;
        mongoose.connect(Environment.mongoUrl as string,
            {
                useNewUrlParser: true
            });
    }
}

export default new App().app
