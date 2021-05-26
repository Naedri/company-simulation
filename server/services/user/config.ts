// server/services/user/config.ts

if (process.env.NODE_ENV === "dev") {
    require('dotenv').config({path: process.cwd() + '/.env.local'});
}

const SECRET = process.env.SECRET;

export default {
    token: {
        secret: SECRET
    }
};
