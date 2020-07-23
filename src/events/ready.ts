import Bot from "../index";
import { Client } from "discord.js";
import { Event } from "../structures";

export default class ReadyEvent extends Event {
  handler(client: Client, bot: Bot) {
    console.info("Bot is ready and running...");

    setInterval(() => {
      const onlineUsersSize = client.users.cache.filter(
        (g) => g.presence.status != "offline"
      ).size;

      bot.mysql.query(
        `INSERT INTO grafanadata (time, guilds, onlinemembers, messages) VALUES (CURRENT_TIMESTAMP(), ${client.guilds.cache.size}, ${onlineUsersSize}, ${bot.stats.messages})`,
        function (err) {
          if (err) {
            console.log("Error while sending Grafana Data:");
            console.error(err);
          }

          bot.stats.messages = 0;
        }
      );
    }, 10000);
  }
}
