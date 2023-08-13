import { message } from "telegraf/filters";
import {
  getNews,
  swearWordsFilter,
  newChatMember,
  leftChatMember,
} from "../controllers";
import { howGayTest } from "../controllers/basic-controllers/how-gay-test";
import { Bot } from "../models/bot";

export const setupBasicRoutes = (bot: Bot) => {
  bot.on(message("text"), async (ctx, next) => {
    await swearWordsFilter(ctx);
    await next();
  });

  bot.command("gay", async (ctx) => {
    await howGayTest(ctx);
  });

  bot.command("news", async (ctx) => {
    await getNews(ctx);
  });

  bot.on(message("new_chat_members"), async (ctx) => {
    await newChatMember(ctx);
  });

  bot.on(message("left_chat_member"), async (ctx) => {
    await leftChatMember(ctx);
  });
};
