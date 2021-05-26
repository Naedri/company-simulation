// server/database/utils.ts

import config from './config';
import utils from "util";

const {Pool} = require("pg");

// connexion initialization
const pool = new Pool({
    user: config.database.user,
    host: config.database.host,
    database: config.database.database,
    password: config.database.password,
    port: config.database.port
});

function executeQuery(sql : String, params : [String]): any {
    pool.query(sql, params, (err: string, res: string) => {
        console.log(config);
    });
    // return new Promise(((resolve, reject) => {
    //     try{
    //         const query = utils.promisify(pool.query);
    //         resolve(query(sql, params));
    //     }catch (e){
    //         reject(e);
    //     }
    // }));
}

export default executeQuery;