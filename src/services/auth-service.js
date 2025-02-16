"use strict";

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const errorHandler = require("./error-handler.js");

exports.generateToken = async data => {
    const token = jwt.sign(data, jwtSecret, { expiresIn: "15m" });
    const issuedAt = Date.now();
    return { token, issuedAt };
};

exports.decodeToken = async token => {
    var data = await jwt.verify(token, jwtSecret);
    console.log("aqui")
    return data;
};

exports.authorize = function (req, res, next) {
    var token =
        req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
        res.status(401).json({
            message: "Acesso Restrito"
        });
    } else {
        jwt.verify(token, jwtSecret, function (error, decoded) {
            if (error) {
                res.status(401).json({
                    message: "Token Invalido"
                });
            } else {
                next();
            }
        });
    }
};

exports.refreshTokenMiddleware = function (req, res, next) {
    var token =
        req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
        res.status(401).json({ message: "Acesso Restrito" });
    } else {
        jwt.verify(token, jwtSecret, function (error, decoded) {
            if (error && error.name === "TokenExpiredError") {
                return errorHandler(error, res);
            } else if (error) {
                res.status(401).json({ message: "Token Inválido" });
            } else {
                next();
            }
        });
    }
};
