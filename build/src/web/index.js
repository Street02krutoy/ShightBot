"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const config_1 = __importDefault(require("../../config"));
const fastify_session_1 = __importDefault(require("fastify-session"));
const fastify_cookie_1 = __importDefault(require("fastify-cookie"));
const point_of_view_1 = __importDefault(require("point-of-view"));
const Util_1 = __importDefault(require("../Util"));
const app = (0, fastify_1.default)();
app.addHook("preHandler", (req, _, next) => {
    req.session.lastPage = req.session.lastPage || "/";
    next();
});
app.register(fastify_cookie_1.default);
app.register(fastify_session_1.default, {
    secret: config_1.default.web.cookieSecret,
    cookie: {
        secure: false,
        sameSite: false,
        maxAge: 2 * 60 * 60 * 1000
    }
});
app.register(point_of_view_1.default, {
    engine: {
        ejs: require("ejs")
    },
    root: __dirname + "/views/"
});
app.register(require("./routes/root"), { prefix: "/" });
//app.register(require("./routes/utils"), { prefix: "/util" });
app.register(require("./routes/dash"), { prefix: "/dash" });
app.register(require("./routes/api"), { prefix: "/api" });
app.listen(config_1.default.web.port, (err, address) => {
    if (!Util_1.default.database)
        return console.error("[Web] Cannot find database.");
    if (err)
        return console.error("Web cannot start.\n" + err.message);
    return console.log("[Web] Started on " + address);
});
