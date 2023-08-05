import { Context, Telegraf } from "telegraf";
import { config } from "../../config";
import { setupRoutes } from "./setup-routes";

class BotApi {
  bot = new Telegraf(config.BOT_TOKEN);

  constructor() {
    setupRoutes(this.bot);
    this.bot.launch();
  }

  stop(reason?: string) {
    this.bot.stop(reason);
  }
}

export const botApi = new BotApi();
