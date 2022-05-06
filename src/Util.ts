import { Client } from "discord.js";
import mongoose from "mongoose";
import { inspect } from "util";

let util: Util | null = null;

class Util {
    constructor() {
        if (util) return util;
        util = this;
    };

    private _client: Client;
    private _database: typeof mongoose;
    public static inspect = inspect;

    public setClient(client: Client): Util {
        this._client = client;
        return this;
    };

    public setDatabase(database: typeof mongoose): Util {
        this._database = database;
        return this;
    };

    get client() {
        return this._client;
    };
    get database() {
        return this._database;
    };
};

export = new Util;