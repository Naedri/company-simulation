import express from "express";
import router from "./router";
import config from './services/user/config';

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const jwt = require('express-jwt');

const app = express();
const PORT = "3000";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
    jwt({
        secret: config.token.secret,
        algorithms: ['HS256'],
        getToken: (req: any) => req.cookies.token
    }).unless({path: ['/users/login']})
);
app.use("/", router);

app.use(function(req, res){
    res.json({
        error:{
            status: 404,
            message: "Route not found!"
        }
    });
});

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});