'use strict';

const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET

exports.generateToken = async (data) => {
    return jwt.sign(data, jwtSecret, { expiresIn: '1d' });
}

exports.decodeToken = async (token) => {
    var data = await jwt.verify(token, jwtSecret);
    return data;
}

exports.authorize = function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) {
        res.status(401).json({
            message: 'Acesso Restrito'
        });
    } else {
        jwt.verify(token, jwtSecret, function (error, decoded) {
            if (error) {
                res.status(401).json({
                    message: 'Token Invalido'
                });
            } else {
                next();
            }
        });
    }
};
