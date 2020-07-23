import { Message, TextChannel, GuildMember } from "discord.js";
import Bot from "./index";

export interface Params {
  command: string;
  message: Message;
  args: string[];
  channel: TextChannel;
  member: GuildMember;
  bot: Bot;
  language: string;
}

export abstract class Command {
  abstract name: string;
  aliases?: string[];
  abstract async run(ctx: Params): Promise<void>;
}

export abstract class Event {
  name?: string;
  abstract handler(...keys: any): void;
}
