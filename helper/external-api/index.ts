import axios from "axios";

class ExternalApi {
  async getDeepStateLatestUpdate() {
    const apiResult = await axios.get(
      "https://deepstatemap.live/api/history/public"
    );
    const historyItems = apiResult.data;

    return historyItems[historyItems.length - 1];
  }
}

export const externalApi = new ExternalApi();
