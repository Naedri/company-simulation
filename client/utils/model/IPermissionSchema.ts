export interface IPermissionSchema {
    [key: string]: {
        locked: boolean,
        [key: string]: boolean
    }
}