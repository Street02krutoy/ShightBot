"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const config_1 = __importDefault(require("../../config"));
const mongoose_1 = __importDefault(require("mongoose"));
const guild_1 = __importDefault(require("./guild"));
const guild_2 = require("./guild");
module.exports = {
    connection: mongoose_1.default.connect(config_1.default.database.uri),
    guild: (0, guild_1.default)(),
    cacheGuilds: guild_2.cacheGuilds,
    global: global
};
