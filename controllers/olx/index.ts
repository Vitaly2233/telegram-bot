import { Flat } from "../../entity/flat";
import { Subscriber } from "../../entity/subscriber";
import { db } from "../../helper/db";
import { logger } from "../../helper/logger";
import { olx, olxText } from "../../helper/olx";
import { Bot } from "../../models/bot";
import { CommandContext } from "../../models/command-context";

export const subscribeHandler = async (ctx: CommandContext) => {
  const sub = new Subscriber();
  sub.chatId = ctx.chat.id;
  try {
    await db.createEntityManager().save(Subscriber, sub);
  } catch (e) {}
};

export const notifyFlatChats = async (bot: Bot) => {
  try {
    const [dbFlats, apiFlatsResponse, subscribers] = await Promise.all([
      db.createEntityManager().find(Flat),
      olx.getFlats(),
      db.createEntityManager().find(Subscriber),
    ]);

    const apiFlats: Flat[] = olx.apiFlatToDbFlat(apiFlatsResponse.data);

    const newFlats = apiFlats.filter(
      (apiFlat) => !dbFlats.find((dbFlat) => dbFlat.id === apiFlat.id)
    );

    await db.createEntityManager().save(Flat, newFlats);

    for (const flat of newFlats) {
      for (const subscriber of subscribers) {
        const groupImages = olx.photosToTelegramGroupMessages(flat.images);
        if (groupImages.length) {
          await bot.telegram.sendMediaGroup(subscriber.chatId, groupImages);
        }
        await bot.telegram.sendMessage(
          subscriber.chatId,
          olxText.newFlat(flat.title, flat.description, flat.price, flat.url)
        );
      }
    }
  } catch (err) {
    await logger.error(
      `Error while sending notification about new flat ${err.message}`,
      err
    );
  }
};
