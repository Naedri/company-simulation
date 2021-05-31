import express from "express";
import swaggerUI from "swagger-ui-express";
import * as swaggerDocument from "../swagger.json";

const router = express.Router();
const SWAGGER_ROUTES_BASE_PATH = "/docs";

router.use("/", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

export {router, SWAGGER_ROUTES_BASE_PATH};