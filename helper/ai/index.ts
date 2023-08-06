import axios from "axios";
import { config } from "../../config";

class AI {
  private async generateText(text: string): Promise<string> {
    const response = await axios.post(
      "https://api.cohere.ai/generate",
      {
        model: "command-xlarge-nightly",
        prompt: text,
      },
      {
        headers: {
          Authorization: `Bearer ${config.COHERE_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const responseText = response?.data?.text;
    return responseText;
  }

  async askAi(question: string) {
    return this.generateText(
      `Write only short answer for the text: ${question}`
    );
  }
}

export const ai = new AI();
