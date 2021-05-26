// server/services/user/user.ts
const bcrypt = require("bcrypt");
import LOGGER from "../../utils/logger";
import executeQuery from '../../database/utils';

/**
 *
 * @param mail
 * @param password
 * @param callback
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
                // TODO remove when registration is available
                const hash = await bcrypt.hash(userFound.encrypted_password, 10);
                const isValidCredentials = await bcrypt.compare(password, hash);

                if (isValidCredentials) {
                    LOGGER.INFO("user.login", "user FOUND with the identifiers");
                    // we delete the password of the user object to avoid expose it
                    delete userFound.encrypted_password;
                    resolve(userFound);
                } else {
                    LOGGER.INFO("user.login", "NONE user found with the identifiers");
                    throw new Error(invalidCredentials);
                }
            }
        } catch (error) {
            reject(new Error(error));
        }
    })
}

/**
 * to know if the user mail is available for register
 * @param mail
 * @param callback
 */
export async function isPresent({mail}: { mail: string }) {
    const query =
        `SELECT COUNT(*)
         FROM STAFF
         WHERE mail = $1`;

    try{
        const result = await executeQuery(query, [mail]);
        let count = result.rows[0].count;
        if (count === '0') {
            LOGGER.INFO("user.present", "user mail is AVAILABLE");
            return false;
        } else {
            LOGGER.INFO("user.present", "user mail is BUSY");
            return true;
        }
    }catch(error){
        return false;
    }
}