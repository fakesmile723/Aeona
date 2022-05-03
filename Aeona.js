const { Client, Collection } = require("discord.js");
const Util = require("./structures/Util");
const config = require("./config.json.js");
const logger = require("./utils/logger");
const { token } = require("./utils/variables");

module.exports = class AeonaClient extends Client {
  constructor(options = {}, sentry) {
    super({
      partials: ["MESSAGE", "CHANNEL", "REACTION", "GUILD_MEMBER", "USER"],
      cacheGuilds: true,
      cacheChannels: true,
      cacheOverwrites: false,
      cacheRoles: true,
      cacheEmojis: true,
      cachePresences: false,
      fetchAllMembers: true,
      disableMentions: "everyone",
      messageCacheMaxSize: 25,
      messageCacheLifetime: 10000,
      shardCount: 1,
      intents: [
        "GUILDS",
        "GUILD_MEMBERS",
        "GUILD_BANS",
        "GUILD_EMOJIS_AND_STICKERS",
        "GUILD_INTEGRATIONS",
        "GUILD_WEBHOOKS",
        "GUILD_INVITES",
        "GUILD_VOICE_STATES",
        "GUILD_MESSAGES",
        "GUILD_MESSAGE_REACTIONS",
        "GUILD_MESSAGE_TYPING",
      ],
    });

    this.validate(options);
    (this.partials = [
      "MESSAGE",
      "CHANNEL",
      "REACTION",
      "GUILD_MEMBER",
      "USER",
    ]),
      (this.commands = new Collection());
    this.events = new Collection();
    this.aliases = new Collection();
    this.utils = require("./utils/utils.js");
    this.mongoose = require("./utils/mongoose");
    this.utils = new Util(this);
    this.config = require("./config.json.js");
  }

  validate(options) {
    if (typeof options !== "object")
      throw new TypeError("Options should be a type of Object.");

    if (!token) throw new Error("You must pass the token for the client.");
    this.token = token;

    if (!options.prefix)
      throw new Error("You must pass a prefix for the client.");
    if (typeof options.prefix !== "string")
      throw new TypeError("Prefix should be a type of String.");
    this.prefix = options.prefix;

    if (!options.mongodb_url)
      throw new Error("You must pass a MONGODB URL for the client.");
  }

  async start(token = this.token) {
    this.utils.loadCommands();
    this.utils
      .loadEvents()

      .catch((e) => console.log(e));

    this.mongoose.init();
    this.login(this.token);
  }
};
