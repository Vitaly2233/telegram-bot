import { CommandContext } from "../models/command-context";
import { randomNumber } from "../utils/random-number";

export const howGayTest = async (ctx: CommandContext) => {
  const gayPercent = randomNumber(0, 101);
  const messageId = ctx.message.message_id;

  await ctx.reply(`Ти гей на ${gayPercent}%`, {
    reply_to_message_id: messageId,
  });
};
