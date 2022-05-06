import { FastifyInstance, HookHandlerDoneFunction } from "fastify";

export = (app: FastifyInstance, _: any, done: HookHandlerDoneFunction) => {
    app.get("/guilds", (req: any, res) => {
        if (!req.session.user) res.redirect("/api/login").status(403);
        req.session.lastPage = "/dash/guilds";
        res.view("guilds.ejs");
    });
    app.get("/guilds/:id", (req: any, res) => {
        if (!req.session.user) res.redirect("/api/login").status(403);
        //@ts-ignore
        let id = req.params.id;
        req.session.lastPage = "/dash/guilds/test";
        res.view("dash.guild.ejs", {id: id});
    });
    done();
};