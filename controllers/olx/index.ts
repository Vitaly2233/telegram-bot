import { Flat } from "../../entity/flat";
import { Subscriber } from "../../entity/subscriber";
import { db } from "../../helper/db";
import { olx } from "../../helper/olx";
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
  const [dbFlats, apiFlatsResponse, subscribers] = await Promise.all([
    db.createEntityManager().find(Flat),
    olx.getFlats(),
    db.createEntityManager().find(Subscriber),
  ]);

  const apiFlats: Flat[] = [];

  for (const flat of apiFlatsResponse.data) {
    apiFlats.push({
      id: flat.id,
      title: flat.title,
      description: flat.description.replaceAll("<br />", ""),
      url: flat.url,
      images: flat.photos.map((photo) => olx.parsePhoto(photo)),
      price: flat.params.find((param) => param.key === "price").value.label,
    });
  }

  const newFlats = apiFlats.filter(
    (apiFlat) => !dbFlats.find((dbFlat) => dbFlat.id === apiFlat.id)
  );

  await db.createEntityManager().save(Flat, newFlats);

  for (const flat of newFlats) {
    for (const subscriber of subscribers) {
      await bot.telegram.sendMediaGroup(
        subscriber.chatId,
        olx.photosToTelegramGroupMessages(flat.images)
      );
      await bot.telegram.sendMessage(
        subscriber.chatId,
        `Нова квартира на олх: ${flat.title}
      
Опис: ${flat.description}

Ціна: ${flat.price}

Лінка: ${flat.url}`
      );
    }
  }
};
