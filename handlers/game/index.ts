import { CommandContext } from "../../models/command-context";

const data: any = {};

export const startWordGame = async (ctx: CommandContext) => {
  const chatId = ctx.chat.id;
  if (data[chatId]) return ctx.reply("Шось питаєшся ноїбать, уже є гра");
  const participants = [ctx.message.from.id];
  data[chatId] = { participants };

  await ctx.reply(`Гра стартонула, учасники: ${JSON.stringify(participants)}`);
};
