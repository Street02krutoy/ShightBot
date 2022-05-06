import { FastifyInstance, HookHandlerDoneFunction } from "fastify";

export = (app: FastifyInstance, _: any, done: HookHandlerDoneFunction) => {
    app.get("/", (req: any, res) => {
        req.session.lastPage = "/";
        res.view("index.ejs");
    });
    app.get("/stats", (req: any, res) => {
        req.session.lastPage = "/stats";
        res.view("stats.ejs");
    });
    done();
};