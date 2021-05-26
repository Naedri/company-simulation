// server/database/config.ts

//import LOGGER from "../../utils/logger";
console.log(process.env.NODE_ENV)
if(process.env.NODE_ENV === "dev"){
	console.log("Entered node dev");
	console.log("Dirname: ", );
    require('dotenv').config({path: __dirname + '/.env.local'});
}

const USER = process.env.DB_USER;
const HOST = process.env.DB_HOST;
const DATABASE = process.env.DB_DATABASE;
const PASSWORD = process.env.DB_PASSWORD;
const PORT = Number(process.env.DB_PORT);

export default {
	database: {
		user: USER,
		host: HOST,
		database: DATABASE,
		password: PASSWORD,
		port: PORT,
	}
};
