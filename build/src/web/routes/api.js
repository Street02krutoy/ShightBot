"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const config_1 = __importDefault(require("../../../config"));
const discord_oauth2_1 = __importDefault(require("discord-oauth2"));
const typebox_1 = require("@sinclair/typebox");
const Util_1 = __importDefault(require("../../Util"));
const oauth2 = new discord_oauth2_1.default({
    clientId: config_1.default.client.id,
    clientSecret: config_1.default.client.secret,
});
module.exports = (app, _, done) => {
    const GuildSettingsO = typebox_1.Type.Object({
        channelId: typebox_1.Type.String(),
        form: typebox_1.Type.Array(typebox_1.Type.String())
    });
    const guildSettingsSchema = new Util_1.default.database.Schema({
        guildId: String,
        channelId: String,
        form: Object,
    });
    const guildSettingsModel = Util_1.default.database.model("guildSettings", guildSettingsSchema);
    app.get("/user", async (request, reply) => {
        if (!request.session.user)
            return reply.status(401);
        return reply.status(200).send(request.session.user);
    });
    app.get("/guilds/:id", async (request, reply) => {
        if (!request.session.user)
            return reply.status(401);
        //@ts-ignore
        let id = request.params.id;
        try {
            Util_1.default.client.guilds.fetch(id).then(async (g) => {
                const channels = g.channels.cache.map(ch => ({ name: ch.name, id: ch.id }));
                let answer = {
                    name: g.name,
                    //settings: {} TODO,
                    id: g.id,
                    channels: channels
                };
                reply.status(200).send(answer);
            }).catch(() => { reply.status(404); });
        }
        catch (e) {
            reply.status(500);
        }
    });
    app.get("/guilds/:id/save", async (request, reply) => {
        if (!request.session.user)
            return reply.status(401);
        //@ts-ignore
        let id = request.params.id;
        Util_1.default.client.guilds.fetch(id).then(async (g) => {
            let thisGuildQuery = await guildSettingsModel.findOne({ guildId: id }) || await guildSettingsModel.create({
                guildId: g.id,
                channelId: "",
                form: [],
            });
            return reply.status(200).send(thisGuildQuery);
        }).catch(() => { reply.status(404); });
    });
    /*app.get("/stats", async (_, reply) => {
        let info = await manager.broadcastEval((bot) => ({ shards: bot.shard.count, guilds: bot.guilds.cache.size, }))
            .then((results) => results.reduce((info, next, index) => {
            for (const [key, value] of Object.entries(next)) {
                if (["guilds", "cachedUsers", "users"].includes(key)) info[key] = (info[key] || 0) + value;
            }
            info.shards[index] = next;
            return info;
        }, { shards: {} }));
        //let info = { shards: 1, guilds: 1 }

        return reply.status(200).send(info)
    })*/
    app.get("/login", (req, res) => {
        res.redirect(oauth2.generateAuthUrl({
            scope: ["identify", "guilds"],
            responseType: "code",
            redirectUri: req.protocol + "://" + req.hostname + "/api/auth",
        }));
    });
    app.get("/logout", (req, res) => {
        req.session.user = null;
        res.redirect(req.session.lastPage);
    });
    app.get("/auth", async (req, res) => {
        const a = await oauth2.tokenRequest({
            code: req.query.code,
            scope: ["identify", "guilds"],
            redirectUri: req.protocol + "://" + req.hostname + "/api/auth",
            grantType: "authorization_code"
        }).catch(() => res.redirect(req.session.lastPage));
        if (!a.access_token)
            return res.redirect("/api/login");
        const user = await oauth2.getUser(a.access_token);
        req.session.user = user;
        res.redirect(req.session.lastPage);
    });
    done();
};
