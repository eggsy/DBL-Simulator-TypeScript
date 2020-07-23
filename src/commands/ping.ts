﻿import { Command, Params } from "../structures";

export default class PingCommand extends Command {
  name = "ping";
  aliases = ["p"];

  async run(ctx: Params) {
    ctx.channel.send(ctx.bot.strings[ctx.language].ping.pong);
  }
}
