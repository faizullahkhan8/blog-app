const JWTservices = require("../services/JWTservice");
const userModle = require("../model/user");
const DTO = require("../DTO/userDTO");
const auth = async (req, res, next) => {
    // 1. validate refresh token and access token

    const { refreshToken, accessToken } = req.cookies;

    try {
        if (!refreshToken || !accessToken) {
            const error = {
                status: 401,
                message: "unathorized",
            };
            return next(error);
        }

        // 2. verify tokens
        const { _id } = JWTservices.verifyAccessToken(accessToken);

        const user = await userModle.findOne({ _id });

        const userDTO = new DTO(user);

        req.user = userDTO;

        next();
    } catch (error) {
        return next(error);
    }
};

module.exports = auth;
