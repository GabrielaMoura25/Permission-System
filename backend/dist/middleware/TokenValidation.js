"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/middleware/TokenValidation.ts
var TokenValidation_exports = {};
__export(TokenValidation_exports, {
  default: () => TokenValidation_default
});
module.exports = __toCommonJS(TokenValidation_exports);

// src/auth/JwtConfig.ts
var jwt = __toESM(require("jsonwebtoken"));
var secretPassword = "secret_key";
var checkToken = (authorization) => {
  try {
    const payload = jwt.verify(authorization, secretPassword);
    return payload;
  } catch (error) {
    return { hasError: true, error };
  }
};

// src/middleware/TokenValidation.ts
var validateToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization == null) {
    return res.status(404).send({ message: "Token Not Found" });
  }
  const payload = checkToken(authorization);
  if ("hasError" in payload && payload.hasError) {
    return res.status(401).send({ message: "Expired Token" });
  }
  console.log(payload);
  next();
};
var TokenValidation_default = validateToken;
