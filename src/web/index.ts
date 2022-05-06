import fastify from "fastify";
import config from "../../config";
import fastifySession from "fastify-session";
import fastifyCookie from "fastify-cookie";
import pov from "point-of-view"
import Util from "../Util";

const app = fastify();


app.addHook("preHandler", (req, _, next) => {
    (req as any).session.lastPage = (req as any).session.lastPage || "/";
    next();
});

app.register(fastifyCookie);
app.register(fastifySession, {
    secret: config.web.cookieSecret,
    cookie: {
        secure: false,
        sameSite: false,
        maxAge: 2 * 60 * 60 * 1000
    }
});

app.register(pov, {
    engine: {
        ejs: require("ejs")
    },
    root: __dirname + "/views/"
});

app.register(require("./routes/root"), { prefix: "/" });
//app.register(require("./routes/utils"), { prefix: "/util" });
app.register(require("./routes/dash"), { prefix: "/dash" });
app.register(require("./routes/api"), { prefix: "/api" });

app.listen(config.web.port, (err, address) => {
    if (!Util.database) return console.error("[Web] Cannot find database.")
    if (err) return console.error("Web cannot start.\n" + err.message);
    return console.log("[Web] Started on " + address);
})