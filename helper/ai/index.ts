import axios from "axios";
import { config } from "../../config";

class AI {
  private async generateText(text: string): Promise<string> {
    const response = await axios.post(
      "https://api.cohere.ai/generate",
      {
        prompt: text,
      },
      {
        headers: {
          Authorization: `Bearer ${config.COHERE_TOKEN}`,
          "Content-Type": "application/json",
          "Cohere-Version": "2021-11-08",
        },
      }
    );

    const responseText = response?.data;
    return responseText;
  }

  async askAi(question: string) {
    return this.generateText(question);
  }
}

export const ai = new AI();
