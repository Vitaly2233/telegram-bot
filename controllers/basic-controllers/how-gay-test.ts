import { CommandContext } from "../../models/command-context";
import { randomNumber } from "../../utils/random-number";

export const howGayTest = async (ctx: CommandContext) => {
  let gayPercent = 0;
  let attempts = 0;
  while (gayPercent !== 101) {
    gayPercent = randomNumber(0, 101);
    attempts++;
  }
  const messageId = ctx.message.message_id;

  await ctx.reply(
    `Ти гей на ${gayPercent}%, На це пішло ${attempts} спроб щоб довести`,
    {
      reply_to_message_id: messageId,
    }
  );
};
