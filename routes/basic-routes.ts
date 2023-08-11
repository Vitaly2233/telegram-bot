import axios from "axios";
import { writeFileSync } from "fs";
import { message } from "telegraf/filters";
import {
  getNews,
  swearWordsFilter,
  newChatMember,
  leftChatMember,
} from "../handlers";
import { howGayTest } from "../handlers/how-gay-test";
import { Bot } from "../models/bot";

export const setupBasicRoutes = async (bot: Bot) => {
  // 575360642
  const response = await axios.post("http://127.0.0.1:5000/reduce_height", {
    url: "https://api.telegram.org/file/bot1667571571:AAFKLsDVDxuy1-RPtBbOCxNa0g0XuTAWkPU/photos/file_1.jpg",
  });
  const buff = Buffer.from(response.data, "base64");

  writeFileSync("ing.png", response.data);

  //@ts-ignore
  await bot.telegram.sendPhoto(575360642, { source: buff });

  // bot.on(message("text"), async (ctx, next) => {
  //   await swearWordsFilter(ctx);
  //   await next();
  // });

  // bot.command("gay", async (ctx) => {
  //   await howGayTest(ctx);
  // });

  // bot.command("news", async (ctx) => {
  //   await getNews(ctx);
  // });

  // bot.on(message("new_chat_members"), async (ctx) => {
  //   await newChatMember(ctx);
  // });

  // bot.on(message("left_chat_member"), async (ctx) => {
  //   await leftChatMember(ctx);
  // });
};
