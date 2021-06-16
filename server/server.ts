import LOGGER from "./utils/logger";

if (process.env.NODE_ENV === "dev") {
    require('dotenv').config({ path: process.cwd() + '/.env.local' });
}

import express from "express";

import bodyParser from "body-parser";
import router from "./router";
import config from './services/user/config';
import SimulationInitializer from "./utils/SimulationInitializer";

const cookieParser = require('cookie-parser');
const jwt = require('express-jwt');
const cors = require('cors');
const http = require("http");
import { Server } from "socket.io";
import SimulationSockets from "./sockets/simulation/SimulationSockets";


const app = express();
const PORT = "3000";
const corsOptions = {
    origin: 'http://localhost:8080',
    credentials: true
};
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
    jwt({
        secret: config.token.secret,
        algorithms: ['HS256'],
        getToken: (req: any) => req.cookies.token
    }).unless({ path: ['/users/login', '/users/register'] })
);

app.use((err: { name: string; status: any; message: any; }, req: any, res: any, next: () => void) => {
    if (err.name === 'UnauthorizedError') {
        res.status(err.status).send({ message: err.message });
        LOGGER.INFO("Auth middleware", "Auth error");
        return;
    }
    next();
});
app.use("/", router);

app.use((req, res) => {
    res.json({
        error: {
            status: 404,
            message: "Route not found!"
        }
    });
});

const httpServer = http.createServer(app);

const socketIO = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:8080"]
    }
});
SimulationSockets.init(socketIO);

httpServer.listen(PORT, () => {
    SimulationInitializer.initSimulationFactory();
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});