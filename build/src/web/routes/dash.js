"use strict";
module.exports = (app, _, done) => {
    app.get("/guilds", (req, res) => {
        if (!req.session.user)
            res.redirect("/api/login").status(403);
        req.session.lastPage = "/dash/guilds";
        res.view("guilds.ejs");
    });
    app.get("/guilds/:id", (req, res) => {
        if (!req.session.user)
            res.redirect("/api/login").status(403);
        //@ts-ignore
        let id = req.params.id;
        req.session.lastPage = "/dash/guilds/test";
        res.view("dash.guild.ejs", { id: id });
    });
    done();
};
