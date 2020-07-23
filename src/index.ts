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
