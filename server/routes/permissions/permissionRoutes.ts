// server/routes/permission/permissionRoutes.ts

import express from "express";
import LOGGER from "../../utils/logger";

const router = express.Router();
const PERMISSION_ROUTES_BASE_PATH = "/permission";

router.get(`/`, (req, res) => {
    LOGGER.INFO("PermissionRoutes", "/ entered");
    res.json({id: 1});
});

export {router, PERMISSION_ROUTES_BASE_PATH};