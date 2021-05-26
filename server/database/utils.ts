// server/database/utils.ts

import config from './config';

const {Pool} = require("pg");

// connexion initialization
const pool = new Pool({
    user: config.database.user,
    host: config.database.host,
    database: config.database.database,
    password: config.database.password,
    port: config.database.port
});

function executeQuery(sql: String, params: [String], callback: Function): any {
    pool.query(sql, params, callback);
}

export default executeQuery;