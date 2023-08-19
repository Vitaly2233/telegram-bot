import { ChatGameInfo } from "../../entity/chat-game-info";
import { db } from "../db";

class GuessWordDb {
  createChatGame = async (chatGameInfo: ChatGameInfo | ChatGameInfo[]) => {
    return db.createEntityManager().save(chatGameInfo);
  };

  getActiveGame = async (chatId: number) => {
    return db.createEntityManager().findOne(ChatGameInfo, {
      where: { chatId, isFinished: false },
      relations: {
        guesses: true,
      },
    });
  };

  finishGame = async (chatId: number) => {
    return db
      .createEntityManager()
      .update(
        ChatGameInfo,
        { chatId, isFinished: false },
        { isFinished: true }
      );
  };

  isUserTakingPart = async (username: string) => {
    return db.createEntityManager().findOne(ChatGameInfo, {
      where: { participants: username, isFinished: false },
    });
  };

  setupStartGame = (
    chatId: number,
    messageId: number,
    wordToGuess: string,
    question: string
  ) => {
    return db
      .createEntityManager()
      .update(
        ChatGameInfo,
        { chatId },
        { gameMessageId: messageId, wordToGuess, question }
      );
  };

  saveEntity = (entity: any) => {
    return db.getRepository(ChatGameInfo).save(entity)
  };
}

export const guessWordDb = new GuessWordDb();
