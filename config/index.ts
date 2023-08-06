import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../", ".env") });

const ENV = process.env;

export const config = {
  BOT_TOKEN: ENV.BOT_TOKEN,
  COHERE_TOKEN: ENV.COHERE_TOKEN,
};
