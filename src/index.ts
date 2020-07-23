import { Client } from "discord.js";
import { Command, Event } from "./structures";
import { readdirSync } from "fs";
import { resolve } from "path";
import { createConnection, Connection } from "mysql";
import UserConfig from "./config";
import strings from "./assets/strings";

export default class Bot extends Client {
  mysql: Connection;
  strings: Strings = strings;
  commands: Map<string, Command> = new Map();
  config: UserConfig;
  stats = {
    messages: 0,
  };

  constructor(config: UserConfig) {
    super();

    this.config = config;

    this.initialize(config.mysql);
    this.loadCommands();
    this.loadEvents();

    this.login(config.botToken);
  }

  initialize(mysqlOptions): void {
    console.info("Trying to create a MySQL connection...");

    this.mysql = createConnection(mysqlOptions);
    this.mysql.query(
      "CREATE TABLE IF NOT EXISTS grafanadata (id BIGINT NOT NULL AUTO_INCREMENT, time DATETIME, guilds int, messages int, onlinemembers int, PRIMARY KEY (id)) CHARSET=utf8mb4",
      function (err) {
        if (err) console.error(err);
      }
    );
  }

  loadCommands(): void {
    const files = readdirSync(resolve("./commands"));

    for (let key in files) {
      const file = files[key];

      if (!file.endsWith(".js")) continue;
      const command: Command = new (require(`./commands/${file}`).default)();

      this.commands.set(
        command.name || file.split(".").slice(0, -1).join("."),
        command
      );

      for (let key in command.aliases) {
        if (this.commands.has(command.aliases[key])) continue;
        this.commands.set(command.aliases[key], command);
      }
    }
  }

  loadEvents(): void {
    const files = readdirSync(resolve("./events"));

    for (let key in files) {
      const file = files[key];

      if (!file.endsWith(".js")) continue;
      const event: Event = new (require(`./events/${file}`).default)();

      const eventName: any = event.name || file;
      this.on(eventName, (...keys: string[]) => event.handler(...keys, this));
    }
  }
}

new Bot(new UserConfig());

/* *******************************************************
console.log("music.marcorennmaus.tk Discordbot booting up...");
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const botsettingsdb = "./settings.json";
const mysql = require("mysql");
const cmd = require("./cmd/main.js");
console.log(fs.readFileSync(botsettingsdb, "utf8"));
var botsettings = JSON.parse(fs.readFileSync(botsettingsdb, "utf8"));
var messagesInLastPeriod = 0;
const DBL = require("dblapi.js");
const dbl = new DBL(botsettings.dbl_token, client);

var mysqlcon = mysql.createConnection({
  host: botsettings.mysql_host,
  user: botsettings.mysql_user,
  password: botsettings.mysql_password,
  database: botsettings.mysql_database,
  charset: "utf8mb4",
});

mysqlcon.query(
  "CREATE TABLE IF NOT EXISTS grafanadata (id BIGINT NOT NULL AUTO_INCREMENT, time DATETIME, guilds int, messages int, onlinemembers int, PRIMARY KEY (id)) CHARSET=utf8mb4",
  function (err, result) {
    if (err) {
      throw "Error while starting up: " + err;
    }
  }
);

client.on("ready", () => {
  console.log("Successfully logged in!");

  //Guild Amount Test

  var guilds = client.guilds.map((g) => g.name).join("\n");
  console.log(guilds);
});

client.on("error", (err) => {
  console.log(err);
});

client.on("message", (msg) => {
  messagesInLastPeriod++;

  if (msg.channel.type === "text") {
    console.log(
      "[" +
        msg.author.username +
        "@" +
        msg.guild.name +
        "/" +
        msg.channel.name +
        "] " +
        msg.content
    );
  }
  if (msg.channel.type === "group") {
    console.log("[" + msg.author.username + "@GROUP/GROUP] " + msg.content);
  }
  if (msg.channel.type === "dm") {
    console.log("[" + msg.author.username + "@DM/DM] " + msg.content);
  }

  if (msg.author.bot) {
    console.log("Author is a bot, ignoring message.");
    return false;
  }
  cmd.main(msg, botsettings, mysql, mysqlcon, client);
});

client.login(botsettings.token);

setInterval(function () {
  var guilds = client.guilds.map((g) => g.name).join("\n");
  var guildarray = guilds.split("\n");

  console.log("Guild Amount:" + guildarray.length);

  var onlineusers = client.users
    .filter((g) => g.presence.status != "offline")
    .map((g) => g.name)
    .join("\n");
  var usersarray = onlineusers.split("\n");
  console.log("User Amount:" + usersarray.length);

  mysqlcon.query(
    "INSERT INTO grafanadata (time, guilds, onlinemembers, messages) VALUES (CURRENT_TIMESTAMP(), " +
      guildarray.length +
      ", " +
      usersarray.length +
      ", " +
      messagesInLastPeriod +
      ");",
    function (err, result, fields) {
      if (err) {
        console.log("Error while sending Grafana Data:");
        console.log(err);
      }
      messagesInLastPeriod = 0;
    }
  );
}, 10000);
******************************************** */
