import { Context, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { setupBasicRoutes } from "./basic-routes";
import { guessWordGameRoutes } from "./guess-word-game-routes";

export const routes = (bot: Telegraf<Context<Update>>) => {
  setupBasicRoutes(bot);
  guessWordGameRoutes(bot);
};
