import { Command, Params } from "../structures";
import { MessageEmbedOptions } from "discord.js";

export default class HelpCommand extends Command {
  name = "help";
  aliases = ["h"];

  async run(ctx: Params) {
    const commands: string[] = [];

    for (let key in ctx.bot.commands) {
      const command: Command = ctx.bot.commands[key];
      commands.push(command.name);
    }

    ctx.channel.send({
      embed: {
        title: ctx.bot.strings[ctx.language].help.title,
        timestamp: Date.now(),
        description: commands.map((v) => `\`${v}\``).join(", "),
      },
    });
  }
}
