if (process.env.NODE_ENV === "dev") {
    require('dotenv').config({path: process.cwd() + '/.env.local'});
}

import express from "express";

import bodyParser from "body-parser";
import router from "./router";
import config from './services/user/config';
import SimulationInitializer from "./utils/SimulationInitializer";

const cookieParser = require('cookie-parser')
const jwt = require('express-jwt');
const cors = require('cors')

const app = express();
const PORT = "3000";
const corsOptions = {
    origin: 'http://localhost:8080',
    credentials: true
};
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
//Todo catch the err

app.use(
    jwt({
        secret: config.token.secret,
        algorithms: ['HS256'],
        getToken: (req: any) => req.cookies.token
    }).unless({path: ['/users/login', '/users/register']})
);
app.use("/", router);

app.use(function (req, res) {
    res.json({
        error: {
            status: 404,
            message: "Route not found!"
        }
    });
});

app.listen(PORT,() => {
    SimulationInitializer.initSimulationFactory();
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});