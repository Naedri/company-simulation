// server/services/user/config.ts
const SECRET = process.env.SECRET;

export default {
    token: {
        secret: SECRET
    }
};
