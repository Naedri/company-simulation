// server/database/config.js
require('dotenv').config({path: __dirname + '/.env'}); // fait reference aux log du service database en pgsql

const USER = process.env.DB_USER;
const HOST = process.env.DB_HOST;
const DATABASE = process.env.DB_DATABASE;
const PASSWORD = process.env.DB_PASSWORD;
const PORT = Number(process.env.DB_PORT);
const SECRET = process.env.DB_SECRET;

module.exports = {
	database: {
		user: USER,
		host: HOST,
		database: DATABASE,
		password: PASSWORD,
		port: PORT,
	},
	secret: SECRET,
};