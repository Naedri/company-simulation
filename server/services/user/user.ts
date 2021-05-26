// server/services/user/user.ts
const {bcrypt} = require("bcrypt");
import LOGGER from "../../utils/logger";
import executeQuery from '../../database/utils';

/**
 *
 * @param mail
 * @param password
 * @param callback
 */
export async function login({mail, password}: { mail: string, password: string }, callback: Function) {
    try {
        const query =
            `SELECT *
         FROM STAFF
         WHERE mail = $1`;

        const invalidCredentials = "invalid credentials";
        const result = await executeQuery(query, [mail]);
        const userFound = result.rows[0];

        if (userFound) {
            let encrypt = await bcrypt.hash(userFound.encrypted_password, 10);
            console.log("ENCRYPT", encrypt, password);
            bcrypt.compare(password, encrypt, (errBcrypt: Error, resBcrypt: any) => {
                if (errBcrypt) {
                    callback(true, errBcrypt);
                } else if (resBcrypt) {
                    LOGGER.INFO("user.login", "user logged");
                    // we delete the password of the user object to avoid expose it
                    delete userFound.encrypted_password;
                    callback(undefined, userFound);
                } else {
                    LOGGER.WARN("user.login", invalidCredentials);
                    callback(true, false);
                }
            });
        } else {
            LOGGER.INFO("user.login", invalidCredentials);
            callback(true, false);
        }
    } catch (e) {
        callback(true, e);
    }

}

/**
 *
 * @param mail
 * @param password
 * @param callback
 */
export function loginWithoutCallback({mail, password}: { mail: string, password: string }) {
    new Promise(async (resolve, reject) => {
        const query =
            `SELECT *
             FROM STAFF
             WHERE mail = $1`;

        const invalidCredentials = "invalid credentials";
        const result = await executeQuery(query, [mail])
            .catch((e: string) => reject(e));

        const userFound = result.rows[0];
        if (userFound) {
            const result = await bcrypt.compare(password, userFound.encrypted_password)
                .catch((e: string) => reject(e));
            if (result) {
                LOGGER.INFO("user.login", "user logged");
                // we delete the password of the user object to avoid expose it
                delete userFound.encrypted_password;
                resolve(userFound);
            }
        }

        LOGGER.INFO("user.login", invalidCredentials);
        reject(invalidCredentials);
    });
}