import { isInvalidMessageText } from "../../helper/bot/is-invalid-message-text";
import { TextContext } from "../../models/text-context";

export const swearWordsFilter = async (ctx: TextContext) => {
  const text = ctx.message.text;

  const isValid = isInvalidMessageText(text);
  if (isValid) {
    await ctx.reply("Не матюкайся!");
  }
};
