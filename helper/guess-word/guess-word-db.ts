import { ChatGameInfo } from "../../entity/chat-game-info";
import { db } from "../db";

class GuessWordDb {
  createChatGame = async (chatGameInfo: ChatGameInfo | ChatGameInfo[]) => {
    return db.createEntityManager().save(chatGameInfo);
  };

  getActiveGame = async (chatId: number) => {
    return db
      .createEntityManager()
      .find(ChatGameInfo, { where: { chatId, isFinished: false } });
  };

  finishGame = async (chatId: number) => {
    return db
      .createEntityManager()
      .update(ChatGameInfo, { chatId }, { isFinished: true });
  };

  isUserTakingPart = async () => {}
}

export const guessWordDb = new GuessWordDb();
