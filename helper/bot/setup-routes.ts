import { Context, Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { Update } from "telegraf/typings/core/types/typegram";
import { randomNumber } from "../../utils/random-number";
import { ai } from "../ai";
import { externalApi } from "../external-api";
import { isInvalidMessageText } from "./is-invalid-message-text";

export const setupRoutes = (bot: Telegraf<Context<Update>>) => {
  bot.on(message("text"), async (ctx, next) => {
    const text = ctx.message.text;
    const messageId = ctx.message.message_id;

    const isValid = isInvalidMessageText(text);
    if (isValid) {
      await ctx.reply("Не матюкайся", {
        reply_to_message_id: messageId,
      });
    }
    await next();
  });

  bot.command("gay", async (ctx) => {
    const gayPercent = randomNumber(0, 101);
    const messageId = ctx.message.message_id;

    const text = await ai.askAi("say hello");

    await ctx.reply(text);

    await ctx.reply(`Ти гей на ${gayPercent}%`, {
      reply_to_message_id: messageId,
    });
  });

  bot.on(message("new_chat_members"), async (ctx) => {
    await ctx.reply("Опа, новий підор пришов");
  });

  bot.on(message("left_chat_member"), async (ctx) => {
    await ctx.reply("Ну і пашол нахуй");
  });

  bot.command("news", async (ctx) => {
    const deepStateResult = await externalApi.getDeepStateLatestUpdate();
    const messageId = ctx.message.message_id;

    await ctx.reply(`DeepState update:\n${deepStateResult.description}`, {
      reply_to_message_id: messageId,
    });
  });
};
