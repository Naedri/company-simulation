export interface IPermissionSchema {
    [key: string]: {
        locked: boolean,
        [key: string]: boolean
    }
}

export function isIPermissionSchema(data: object): data is IPermissionSchema {
    for (const [componentType, permissions] of Object.entries(data)) {
        if (typeof componentType !== "string") return false;

        if (typeof permissions !== "object") return false;

        if (permissions === null) return false;

        if (!("locked" in permissions)) return false;

        for (const [attributeName, attributePermission] of Object.entries(permissions)) {
            if (typeof attributeName !== "string") return false;

            if (typeof attributePermission !== "boolean") return false;
        }
    }
    return true;
}
