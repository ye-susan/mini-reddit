"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const constants_1 = require("./constants");
const Post_1 = require("./entities/Post");
const User_1 = require("./entities/User");
const path_1 = __importDefault(require("path"));
exports.default = {
    migrations: {
        path: path_1.default.join(__dirname, './migrations'),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [Post_1.Post, User_1.User],
    dbName: "mini-reddit",
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: "localhost",
    port: 5432,
    type: "postgresql",
    debug: !constants_1.__prod__
};
//# sourceMappingURL=mikro-orm.config.js.map