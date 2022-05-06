import { FastifyInstance, HookHandlerDoneFunction } from "fastify";
import config from '../../../config';
import discordoauth2 from "discord-oauth2";
import { manager } from "../../sharding";
import { Static, Type } from '@sinclair/typebox'
import Util from "../../Util";
import {Guild} from "discord.js";
const oauth2 = new discordoauth2({
    clientId: config.client.id,
    clientSecret: config.client.secret,
});


export = (app: FastifyInstance, _: any, done: HookHandlerDoneFunction) => {
    const GuildSettingsO = Type.Object({
        channelId: Type.String(),
        form: Type.Array(Type.String())
    })
    type GuildSettingsT = Static<typeof GuildSettingsO>

    const guildSettingsSchema = new Util.database.Schema({
        guildId: String,
        channelId: String,
        form: Object,
    })

    const guildSettingsModel = Util.database.model("guildSettings", guildSettingsSchema)
    app.get("/user", async (request, reply) => {
        if (!request.session.user) return reply.status(401)
        return reply.status(200).send(request.session.user)
    });

    app.get("/guilds/:id", async (request, reply) => {
        if (!request.session.user) return reply.status(401);
        //@ts-ignore
        let id = request.params.id
        try {
            Util.client.guilds.fetch(id).then(async (g:Guild)=>{
                const channels = g.channels.cache.map(ch=>({name: ch.name, id: ch.id}))
                let answer:Object = {
                    name: g.name,
                    //settings: {} TODO,
                    id: g.id,
                    channels: channels
                }
                reply.status(200).send(answer)
            }).catch(()=>{reply.status(404)})
        }catch (e) {
            reply.status(500)
        }
    });
    app.get<{ Body: GuildSettingsT }>("/guilds/:id/save", async (request, reply) => {

        if (!request.session.user) return reply.status(401)
        //@ts-ignore
        let id = request.params.id
        Util.client.guilds.fetch(id).then(async (g)=>{
            let thisGuildQuery = await guildSettingsModel.findOne({ guildId: id }) || await guildSettingsModel.create({
                guildId: g.id,
                channelId: "",
                form: [],
            });
            return reply.status(200).send(thisGuildQuery)
        }).catch(()=>{reply.status(404)})

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

    app.get("/login", (req, res): any => {
        res.redirect(
            oauth2.generateAuthUrl({
                scope: ["identify", "guilds"],
                responseType: "code",
                redirectUri: req.protocol + "://" + req.hostname + "/api/auth",
            }))
    });
    app.get("/logout", (req: any, res) => {
        req.session.user = null;
        res.redirect(req.session.lastPage);
    });
    app.get("/auth", async (req: any, res) => {
        const a = await oauth2.tokenRequest({
            code: req.query.code,
            scope: ["identify", "guilds"],
            redirectUri: req.protocol + "://" + req.hostname + "/api/auth",
            grantType: "authorization_code"
        }).catch(() => res.redirect(req.session.lastPage));

        if (!a.access_token) return res.redirect("/api/login");
        req.session.user = await oauth2.getUser(a.access_token);
        res.redirect(req.session.lastPage);
    });
    done();
};