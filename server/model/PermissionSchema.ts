export interface PermissionSchema {
    [key: string]: {
        locked?: boolean,
        attributes?: {
            [key: string]: boolean
        },
        relations?: {
            [key: string]: boolean
        },
    }
}