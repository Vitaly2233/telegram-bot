import { message } from "telegraf/filters";
import { handleSendWord, startWordGame, takePart } from "../handlers";
import { Bot } from "../models/bot";
import { CallbackData } from "../models/word-game";

export const guessWordGameRoutes = async (bot: Bot) => {
  bot.command("start_word_game", async (ctx) => {
    await startWordGame(ctx);
  });

  bot.action(CallbackData.TakePart, async (ctx) => {
    await takePart(ctx);
  })

  bot.on(message('text'), async (ctx, next) => {
    await handleSendWord(ctx);

    await next();
  })
};
