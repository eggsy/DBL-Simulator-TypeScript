import { Command, Params } from "../structures";
import reasons from "../assets/reasons";

export default class MuteCommand extends Command {
  name = "mute";
  aliases = ["m"];

  async run(ctx: Params) {
    const person =
      ctx.message.mentions.members?.first()?.user?.tag || ctx.member.user?.tag;

    const randomNumber = {
      reasons: Math.floor(Math.random() * (reasons.ban.length || 0)),
      modNames: Math.floor(
        Math.random() * (ctx.bot.config.modNames?.length || 0)
      ),
    };

    ctx.channel.send({
      embed: {
        title: ctx.bot.strings[ctx.language].declinebots.titleMute,
        color: ctx.bot.config.colors.mute,
        timestamp: Date.now(),
        fields: [
          {
            name: ctx.bot.strings[ctx.language].declinebots.user,
            value: person,
            inline: true,
          },
          {
            name: ctx.bot.strings[ctx.language].declinebots.mod,
            value: ctx.bot.config.modNames[randomNumber.modNames],
            inline: true,
          },
          {
            name: ctx.bot.strings[ctx.language].declinebots.reason,
            value: reasons.mute[randomNumber.reasons],
          },
        ],
      },
    });
  }
}
