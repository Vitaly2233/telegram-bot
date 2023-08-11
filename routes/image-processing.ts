import axios from "axios";
import { Bot } from "../models/bot";

export const imageProcessing = (bot: Bot) => {
  bot.on("photo", async (ctx) => {
    const photo = ctx.update.message.photo;

    if (photo.length > 0) {
      const fileId = photo[photo.length - 1].file_id;

      const url = await bot.telegram.getFileLink(fileId);

      const response = await axios.post("http://127.0.0.1:5000/reduce_height", {
        url,
      });
      const buff = Buffer.from(response.data, "base64");
console.log(ctx.chat.id);

      await ctx.replyWithPhoto({
        source: buff,
        filename: "file.png",
      });
    }
  });
};
