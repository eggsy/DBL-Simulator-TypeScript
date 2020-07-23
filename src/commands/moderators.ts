﻿import { Command, Params } from "../structures";
import randomMessages from "../assets/randomPings";

export default class ModeratorsCommand extends Command {
  name = "moderators";
  aliases = ["mods", "atmods", "@"];

  async run(ctx: Params) {
    const random = Math.floor(Math.random() * randomMessages.length);
    ctx.channel.send(randomMessages[random]);
  }
}
