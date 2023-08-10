import { message } from "telegraf/filters";
import { guessWordGame } from "../helper/guess-word";
import { Bot } from "../models/bot";
import { CallbackData } from "../models/word-game";

export const guessWordGameRoutes = async (bot: Bot) => {
  bot.command("start_word_game", async (ctx) => {
    await guessWordGame.handleStartGame(ctx);
  });

  bot.command("finish_word_game", async (ctx) => {
    await guessWordGame.handleFinishGame(ctx);
  })

  bot.action(CallbackData.TakePart, async (ctx) => {
    await guessWordGame.handleUserTakePart(ctx);
  });

  bot.on(message("text"), async (ctx, next) => {
    await guessWordGame.handleUserSentWord(ctx);

    await next();
  });
};
