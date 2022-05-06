"use strict";
const fs_1 = require("fs");
module.exports = (app, _, done) => {
    app.get("/fomantic/semantic.min.js", (req, res) => {
        res.send((0, fs_1.createReadStream)(`${__dirname}/../utils/semantic/dist/semantic.min.js`));
    });
    app.get("/fomantic/semantic.min.css", (req, res) => {
        res.send((0, fs_1.createReadStream)(`${__dirname}/../utils/semantic/dist/semantic.min.css`));
    });
    done();
};
