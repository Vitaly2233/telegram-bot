import { botApi } from "../bot";

class Logger {
  async error(message: string, err?: Error) {
    const errorMessage = `Error occurred: ${message} ${JSON.stringify(err)}`;

    console.error(errorMessage);
    await botApi.bot.telegram.sendMessage(575360642, errorMessage);
  }
}

export const logger = new Logger();
