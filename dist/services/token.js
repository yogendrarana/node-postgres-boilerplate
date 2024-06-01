import jwt from "jsonwebtoken";
// create access token
export const createAccessToken = function (id) {
    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
};
// create refresh token of random uuid
export const createRefreshToken = function (id) {
    return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
};
