// server/database/config.ts

if(process.env.NODE_ENV === "dev"){
    require('dotenv').config({path: process.cwd() + '/.env.local'});
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
		port: PORT
	}
};
