import { startWordGame } from "../handlers";
import { Bot } from "../models/bot";

export const guessWordGameRoutes = async (bot: Bot) => {
  bot.command("start_word_game", async (ctx) => {
    await startWordGame(ctx);
  });
};
