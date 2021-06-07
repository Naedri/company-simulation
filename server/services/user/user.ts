// server/services/user/user.ts
const bcrypt = require("bcrypt");
import LOGGER from "../../utils/logger";
import executeQuery from '../../database/utils';

const SALT_ROUNDS = 5;
const ADMIN_LABEL= "admin";

export type User = {
    id: string;
    first_name: string;
    last_name: string;
    mail: string;
    role_id: string;
    created_date?: Date;
    encrypted_password?: string; //do not expose
};

/**
 *
 * @param mail
 * @param password
 */
export function login({mail, password}: { mail: string, password: string }) {
    return new Promise(async (resolve, reject) => {
        try {
            const query =
                `SELECT *
                 FROM STAFF
                 WHERE mail = $1`;
            const invalidCredentials = "invalid credentials";

            const result = await executeQuery(query, [mail]);
            const userFound = result.rows[0];

            if (userFound) {
                const isValidCredentials = await bcrypt.compare(password, userFound.encrypted_password);

                if (isValidCredentials) {
                    LOGGER.INFO("user.login", "user FOUND with the identifiers");
                    // we delete the password of the user object to avoid expose it
                    delete userFound.encrypted_password;
                    resolve(userFound);
                } else {
                    LOGGER.INFO("user.login", "NONE user found with the identifiers");
                    reject(new Error("Password or email invalid."));
                }
            } else {
                LOGGER.INFO("user.login", "NONE user found with the identifiers");
                reject(new Error(invalidCredentials));
            }
        } catch (error) {
            LOGGER.ERROR("user.login", error);
            reject(new Error(error));
        }
    })
}

/**
 * to know if the user mail is available for register
 * @param mail
 * @param callback
 */
export async function isPresent({mail}: { mail: string }): Promise<boolean> {
    const query =
        `SELECT COUNT(*)
         FROM STAFF
         WHERE mail = $1`;
    try {
        const result = await executeQuery(query, [mail]);
        if (result.rows[0].count === '0') {
            LOGGER.INFO("user.present", "user mail is AVAILABLE");
            return false;
        } else {
            LOGGER.INFO("user.present", "user mail is BUSY");
            return true;
        }
    } catch (error) {
        LOGGER.ERROR("user.present", error);
        return true;
    }
}

export async function getRoleId({mail}: {mail: string}): Promise <string>{
    const query =
        `SELECT role_id from STAFF
        WHERE mail = $1`;
    try {
        const result = await executeQuery(query, [mail]);
        const roleId : string = result.rows[0].role_id;
        const message : string = "role id is " + roleId;
        LOGGER.INFO("user.roleId", message);
        return roleId;
    } catch (error){
        LOGGER.ERROR("user.roleId", error);
        return "-1";
    }
}


/**
 *
 * @param role_id of the user to evaluate
 */
export async function isAdmin({role_id}: {role_id: string}): Promise <boolean>{
    const query =
        `SELECT label from ROLE
        WHERE id = $1`;
    try {
        const result = await executeQuery(query, [role_id]);
        const isAdmin : boolean = result.rows[0].label === ADMIN_LABEL;
        const message: string = "role is" + (isAdmin ? " " : " not " ) + "admin";
        LOGGER.INFO("user.admin", message);
        return isAdmin;
    } catch (error){
        LOGGER.ERROR("user.admin", error);
        return false;
    }
}

export async function register({mail, password}: { mail: string, password: string }) {
    try {
        const encrypted = await bcrypt.hash(password, SALT_ROUNDS);
        const query =
            `INSERT INTO STAFF (mail, encrypted_password)
             VALUES ($1, $2) RETURNING id`;
        const result = await executeQuery(query, [mail, encrypted]);
        const created = result.rowCount > 0;
        if (created){
            LOGGER.INFO("user.register", "user created: " + mail);
            return {user: {mail, id: result.rows[0].id} , error: null}
        }
        LOGGER.INFO("user.register", "user creation failed");
        return {user: null, error: new Error("Creation failed")}
    } catch (e) {
        LOGGER.ERROR("user.register", "user creation failed: " + e);
        return {user: null, error: e};
    }
}
