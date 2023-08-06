import { botApi } from "../helper/bot";
import { isInvalidMessageText } from "../helper/bot/is-invalid-message-text";
import { TextContext } from "../models/text-context";

export const swearWordsFilter = async (ctx: TextContext) => {
  const text = ctx.message.text;

  const isValid = isInvalidMessageText(text);
  if (isValid) {
    await ctx.reply("Не матюкайся!", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "take a part",
              callback_data: "option1",
            },
          ],
        ],
      },
    });

    // await botApi.bot.telegram.sendMessage(userId, "Private message", {
    //   disable_notification: false,
    // });
    //   ctx.reply("Не матюкайся!", {
    //   reply_markup: {
    //     inline_keyboard: [
    //       [
    //         {
    //           text: "take a part",
    //           callback_data: "option1",
    //         },
    //       ],
    //     ],
    //   },
    // });
  }
};
