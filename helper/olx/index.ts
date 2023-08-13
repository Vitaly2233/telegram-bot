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

  apiFlatToDbFlat = (flats: any[]) => {
    return flats.map((flat) => ({
      id: flat?.id,
      title: flat?.title,
      description: flat?.description.replaceAll("<br />", ""),
      url: flat?.url,
      images: flat?.photos.map((photo) => olx.parsePhoto(photo)),
      price: flat?.params.find((param) => param.key === "price").value.label,
    }));
  };
}

export const olxText = {
  newFlat: (
    title: string,
    description: string,
    price: string,
    url: string
  ) => `Нова квартира на олх: ${title}
        
  Опис: ${description}
  
  Ціна: ${price}
  
  Лінка: ${url}`,
};

export const olx = new Olx();
