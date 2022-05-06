"use strict";
module.exports = (app, _, done) => {
    app.get("/", (req, res) => {
        req.session.lastPage = "/";
        res.view("index.ejs");
    });
    app.get("/stats", (req, res) => {
        req.session.lastPage = "/stats";
        res.view("stats.ejs");
    });
    done();
};
