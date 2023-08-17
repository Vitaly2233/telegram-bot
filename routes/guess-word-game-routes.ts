import { message } from "telegraf/filters";
import {
  handleFinishGame,
  handleStartGame,
  handleUserTakePart,
  handleUserSendWord,
} from "../controllers";
import { Bot } from "../models/bot";
import { CallbackData } from "../models/word-game";

export const guessWordGameRoutes = async (bot: Bot) => {
  bot.command("start_word_game", async (ctx) => {
    await handleStartGame(ctx);
  });

  bot.command("finish_word_game", async (ctx) => {
    await handleFinishGame(ctx);
  });

  bot.action(CallbackData.TakePart, async (ctx) => {
    await handleUserTakePart(ctx);
  });

  bot.on(message("text"), async (ctx, next) => {
    await handleUserSendWord(ctx);

    await next();
  });
};
