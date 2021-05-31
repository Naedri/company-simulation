// server/database/utils.ts
import databaseConfig from './config';

const {Pool} = require("pg");

// connexion initialization
const pool = new Pool({
    user: databaseConfig.user,
    host: databaseConfig.host,
    database: databaseConfig.database,
    password: databaseConfig.password,
    port: databaseConfig.port
});

function executeQuery(sql: String, params: [String]): any {
    return pool.query(sql, params);
}

export default executeQuery;