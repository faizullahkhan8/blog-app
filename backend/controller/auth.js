const Joi = require("joi");
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const DTO = require("../DTO/userDTO");
const user = require("../model/user");
const JWTservices = require("../services/JWTservice");
const RefreshToken = require("../model/token");

const auth = {
    async register(req, res, next) {
        // validate user data
        const userRegisterationSchema = Joi.object({
            name: Joi.string().max(30).required(),
            username: Joi.string().min(5).max(30).required(),
            email: Joi.string().min(8).max(30).required(),
            password: Joi.string().min(8).max(25).required(),
            confirmPassword: Joi.ref("password"),
        });

        const { error } = userRegisterationSchema.validate(req.body);

        // if error then throw error via => middleware
        if (error) {
            next(error);
        }

        // if not error then cheak that is user already existed
        const { name, username, email, password } = req.body;

        try {
            const userNameInUse = await User.exists({ username });
            const emailInUse = await User.exists({ email });

            if (userNameInUse) {
                const error = {
                    status: 409,
                    message: "username avilible",
                };
                return next(error);
            }

            if (emailInUse) {
                const error = {
                    status: 409,
                    message: "Email Already in Use",
                };

                return next(error);
            }
        } catch (error) {
            return next(error);
        }

        // password hash
        const hashedPassword = await bcrypt.hash(password, 10);

        // register user
        let accessToken;
        let refreshToken;
        try {
            const userToRegister = new User({
                name,
                username,
                email,
                password: hashedPassword,
            });

            const saveUser = await userToRegister.save();

            //token generation
            accessToken = JWTservices.signAccessToken(
                { _id: saveUser._id },
                "30m"
            );

            refreshToken = JWTservices.signRefreshToken(
                { _id: saveUser._id },
                "60m"
            );

            // store token in db
            await JWTservices.storeRefreshToken(refreshToken, saveUser._id);

            // send tokens via cookies
            res.cookie("accessToken", accessToken, {
                maxage: 1000 * 60 * 60 * 24,
                secure: true, // Required for HTTPS (Surge uses HTTPS)
                sameSite: "none", // Required for cross-origin requests
                httpOnly: true,
            });

            res.cookie("refreshToken", refreshToken, {
                maxage: 1000 * 60 * 60 * 24,
                secure: true, // Required for HTTPS (Surge uses HTTPS)
                sameSite: "none", // Required for cross-origin requests
                httpOnly: true,
            });

            const userDTO = new DTO(saveUser);

            // send response
            return res.status(201).json({ user: userDTO, auth: true });
        } catch (error) {
            return next(error);
        }
    },

    async login(req, res, next) {
        //validate user inputs
        const userLoginSchema = Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required(),
        });

        const { error } = userLoginSchema.validate(req.body);

        //if validation error , return error
        if (error) {
            return next(error);
        }

        // match username and password

        const { username, password } = req.body;

        try {
            const isUserExists = await User.findOne({ username: username });

            if (!isUserExists) {
                const error = {
                    status: 401,
                    message: "invalid username",
                };
                return next(error);
            }

            const isPasswordMatch = await bcrypt.compare(
                password,
                isUserExists.password
            );

            if (!isPasswordMatch) {
                const error = {
                    status: 401,
                    message: "Invalid Password",
                };

                return next(error);
            }

            let accessToken;
            let refreshToken;

            // generate tokens
            accessToken = JWTservices.signAccessToken(
                { _id: isUserExists._id },
                "30m"
            );

            refreshToken = JWTservices.signRefreshToken(
                { _id: isUserExists._id },
                "60m"
            );

            await RefreshToken.updateOne(
                {
                    userId: isUserExists._id,
                },
                { token: refreshToken },
                { upsert: true }
            );

            res.cookie("accessToken", accessToken, {
                maxAge: 1000 * 60 * 60 * 24,
                secure: true, // Required for HTTPS (Surge uses HTTPS)
                sameSite: "none", // Required for cross-origin requests
                httpOnly: true,
            });

            res.cookie("refreshToken", refreshToken, {
                maxAge: 1000 * 60 * 60 * 24,
                secure: true, // Required for HTTPS (Surge uses HTTPS)
                sameSite: "none", // Required for cross-origin requests
                httpOnly: true,
            });

            const userDTO = new DTO(isUserExists);

            return res.status(200).json({ userDTO, auth: true });
        } catch (error) {
            return next(error);
        }
    },

    async logout(req, res, next) {
        try {
            // delete refresh token from db
            const { refreshToken } = req.cookies;
            await RefreshToken.deleteOne({ token: refreshToken });

            // delete cookie from client side
            res.clearCookie("refreshToken");
            res.clearCookie("accessToken");

            // send response
            return res.status(200).json({ user: null, auth: false });
        } catch (error) {
            return next(error);
        }
    },

    async refresh(req, res, next) {
        // 1. get token from cookies
        const orignalRefreshToken = req.cookies.refreshToken;
        // 2. verify tokens
        let id;
        try {
            id = JWTservices.verifyRefreshToken(orignalRefreshToken)._id;
        } catch (error) {
            return next(error);
        }

        try {
            const match = await RefreshToken.findOne({
                _id: id,
                token: orignalRefreshToken,
            });

            if (!match) {
                const error = {
                    status: 401,
                    message: "unathorized",
                };
            }
        } catch (error) {
            return next(error);
        }

        // 3. generates new tokens
        try {
            const refreshToken = JWTservices.signRefreshToken(
                { _id: id },
                "30m"
            );
            const accessToken = JWTservices.signAccessToken({ _id: id }, "60m");

            await RefreshToken.updateOne(
                { userId: id },
                { token: refreshToken }
            );

            res.cookie("refreshToken", refreshToken, {
                maxAge: 1000 * 60 * 60 * 24,
                secure: true, // Required for HTTPS (Surge uses HTTPS)
                sameSite: "none", // Required for cross-origin requests
                htttpOnly: true,
            });

            res.cookie("accessToken", accessToken, {
                maxAge: 1000 * 60 * 60 * 24,
                secure: true, // Required for HTTPS (Surge uses HTTPS)
                sameSite: "none", // Required for cross-origin requests
                htttpOnly: true,
            });
        } catch (error) {
            return next(error);
        }

        // 4. uptade db
        const user = await User.findOne({ _id: id });
        const userDTO = new DTO(user);

        res.status(200).json({ user: userDTO, auth: true });
    },
};

module.exports = auth;
