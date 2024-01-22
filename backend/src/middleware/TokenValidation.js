"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JwtConfig_1 = require("../auth/JwtConfig");
const validateToken = (req, res, next) => {
    const { authorization } = req.headers;
    if (authorization == null) {
        return res.status(404).send({ message: 'Token Not Found' });
    }
    const payload = (0, JwtConfig_1.checkToken)(authorization);
    if ('hasError' in payload && payload.hasError) {
        return res.status(401).send({ message: 'Expired Token' });
    }
    console.log(payload);
    next();
};
exports.default = validateToken;
