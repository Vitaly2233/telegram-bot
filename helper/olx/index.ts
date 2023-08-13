import axios from "axios";
import { MediaGroup } from "telegraf/typings/telegram-types";

class Olx {
  async getFlats() {
    const response = await axios.get("https://www.olx.ua/api/v1/offers", {
      params: {
        offset: 0,
        limit: 40,
        category_id: 1760,
        region_id: 12,
        city_id: 306,
      },
    });

    return response.data;
  }

  parsePhoto(photo) {
    const link = photo.link as string;

    const sliced = link.substring(0, link.indexOf("s={width}x{height}"));
    return `${sliced}s=${photo.width}x${photo.height}`;
  }

  photosToTelegramGroupMessages = (images: string[]): MediaGroup => {
    return images.reduce((acc, image, index) => {
      if (index > 9) return acc;
      acc.push({ type: "photo", media: image });
      return acc;
    }, []);
  };
}

export const olx = new Olx();
