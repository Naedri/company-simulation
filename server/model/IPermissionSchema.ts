/**
 * Protect user from modifying a simulation state
 */
export interface IPermissionSchema {
    [key: string]: {
        locked: boolean,
        [key: string]: boolean
    }
}