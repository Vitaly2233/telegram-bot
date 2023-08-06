import { Telegraf } from "telegraf";
import { config } from "../../config";
import { routes } from "../../routes";

class BotApi {
  bot = new Telegraf(config.BOT_TOKEN);

  constructor() {
    routes(this.bot);
    this.bot.launch();
  }

  stop(reason?: string) {
    this.bot.stop(reason);
  }
}

export const botApi = new BotApi();
