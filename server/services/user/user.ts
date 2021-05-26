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
export function login({
                          mail,
                          password
                      }: { mail: string, password: string }, callback: (err: Error | null, result: any) => void) {
    const query =
        `SELECT *
         FROM STAFF
         WHERE mail = $1`;
    const invalidCredentials = "invalid credentials";

    executeQuery(query, [mail], (err: Error, result: any) => {
        if (err) {
            callback(err, err);
        } else {
            const userFound = result.rows[0];
            if (userFound) {
                // TODO remove when registration is available
                bcrypt.hash(userFound.encrypted_password, 10).then((hash: string) => {
                    bcrypt.compare(password, hash, (bcryptError: Error, validCredentials: any) => {
                        if (bcryptError) {
                            callback(bcryptError, bcryptError);
                        } else {
                            if (validCredentials) {
                                LOGGER.INFO("user.login", "user FOUND with the identifiers");
                                // we delete the password of the user object to avoid expose it
                                delete userFound.encrypted_password;
                                callback(null, userFound);
                            } else {
                                LOGGER.INFO("user.login", "NONE user found with the identifiers");
                                callback(new Error(invalidCredentials), new Error(invalidCredentials));
                            }
                        }
                    });
                })
            } else {
                LOGGER.INFO("user.login", "NONE user found with the identifiers");
                callback(new Error(invalidCredentials), new Error(invalidCredentials));
            }
        }
    });
}