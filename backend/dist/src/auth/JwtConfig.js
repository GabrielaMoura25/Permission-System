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

// src/auth/JwtConfig.ts
var JwtConfig_exports = {};
__export(JwtConfig_exports, {
  checkToken: () => checkToken,
  generateToken: () => generateToken,
  getUserFromToken: () => getUserFromToken
});
module.exports = __toCommonJS(JwtConfig_exports);
var jwt = __toESM(require("jsonwebtoken"));
var secretPassword = "secret_key";
var generateToken = (user) => {
  const token = jwt.sign({ data: user }, secretPassword, { algorithm: "HS256" });
  return token;
};
var checkToken = (authorization) => {
  try {
    const payload = jwt.verify(authorization, secretPassword);
    return payload;
  } catch (error) {
    return { hasError: true, error };
  }
};
var getUserFromToken = (token) => {
  const user = jwt.decode(token);
  return user;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  checkToken,
  generateToken,
  getUserFromToken
});
