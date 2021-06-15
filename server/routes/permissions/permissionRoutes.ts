// server/routes/permission/permissionRoutes.ts

import express from "express";
import LOGGER from "../../utils/logger";
import { ControlPermissions } from "../../controllers/ControlPermissions";
import { IPermissionSchema } from "../../model/IPermissionSchema";

const router = express.Router();
const PERMISSION_ROUTES_BASE_PATH = "/permissions";

router.get(`/`, (req, res) => {
    LOGGER.INFO("PermissionRoutes", "/ entered");
    const result = ControlPermissions.getPermissions();
    res.status(200).json(result);
});

router.put(`/`, (req, res) => {
    const user = (req as any).user;
    if (user.isAdmin) {
        const permission = req.body as IPermissionSchema;
        LOGGER.INFO("PermissionRoutes", `${PERMISSION_ROUTES_BASE_PATH}/ entered`);
        ControlPermissions.updatePermissions(permission);
        res.status(200).json(JSON.stringify(ControlPermissions.getPermissions()));
    } else {
        res.sendStatus(401);
    }
});

export { router, PERMISSION_ROUTES_BASE_PATH };
