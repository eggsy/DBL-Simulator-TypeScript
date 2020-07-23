import Bot from "../index";
import { Message } from "discord.js";
import { Command, Event } from "../structures";

export default class MessageEvent extends Event {
  handler(message: Message, bot: Bot) {
    if (
      message.channel.type !== "text" ||
      message.author.bot ||
      !message.content.startsWith(bot.config.prefix)
    )
      return;

    const args: string[] = message.content.split(" ").slice(0, 1);

    if (!bot.commands.has(args[0])) return;
    const cmd: Command = bot.commands.get(args[0]);

    let language: string = "en";

    // Weird language selector incoming
    if (Math.random() > 0.95) language = "tr";
    else language = "en";

    bot.stats.messages++;
    cmd.run({
      command: cmd.name,
      message: message,
      args: args,
      channel: message.channel,
      member: message.member,
      bot: bot,
      language: language,
    });
  }
}
