"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildSettings = void 0;
const index_1 = require("../index");
const mongoose_1 = __importDefault(require("mongoose"));
class GuildSettings {
    constructor(settings) {
        (async () => {
            const settingsSchema = new mongoose_1.default.Schema({
                guildId: String,
                channelId: String,
                message: String,
                form: Object,
            });
            const settingsD = index_1.db.model('guild', settingsSchema);
            this.channelId = settings.channelId;
            this.message = settings.message;
            this.form = settings.form;
            this.guildId = settings.guildId;
            this.database = await settingsD.findOne({ guildId: this.guildId });
            if (!this.database)
                this.database = await settingsD.create({ guildId: this.guildId, channelId: this.channelId, message: this.message, form: this.form });
        })();
    }
    save() {
        this.database.set({ guildId: this.guildId, channelId: this.channelId, message: this.message, form: this.form });
    }
    set(save, channelId, message, form) {
        if (channelId)
            this.channelId = channelId;
        if (message)
            this.message = message;
        if (form)
            this.form = form;
        if (save)
            this.save();
    }
    get() {
        return this.database;
    }
}
exports.GuildSettings = GuildSettings;
