import { subscribeHandler } from "../controllers";
import { Bot } from "../models/bot";

export const olxParser = (bot: Bot) => {
  bot.command("subscribe_flats", async (ctx) => {
    await subscribeHandler(ctx);

    //TODO rest in peace
    // const response = await axios.get(
    //   "https://www.olx.ua/uk/nedvizhimost/kvartiry/dolgosrochnaya-arenda-kvartir/smela/?currency=UAH"
    // );

    // const $ = Cheerio.load(response.data);

    // const flatData = [];
    // $("a.css-rc5s2u").each((i, element) => {
    //   const elementMatcher = $(element);

    //   const orderName = elementMatcher.find("h6.css-16v5mdi").first().text();
    //   const locationDate = elementMatcher
    //     .find('p[data-testid="location-date"]')
    //     .first()
    //     .text();
    //   const price = elementMatcher
    //     .find('p[data-testid="ad-price"]')
    //     .first()
    //     .text();
    //   const href = element.attribs.href;
    //   const link = `https://www.olx.ua${href}`;
    //   const imgElement = elementMatcher.find("div.css-gl6djm img").first();
    //   const imgLink = imgElement.attr("src");

    //   flatData.push({ orderName, locationDate, price, link, imgLink });
    // });
  });
};
