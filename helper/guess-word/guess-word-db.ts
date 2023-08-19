import { GuessWordGameInfo } from "../../entity/guess-wordd-game-info";
import { db } from "../db";

class GuessWordDb {
  createChatGame = async (
    chatGameInfo: GuessWordGameInfo | GuessWordGameInfo[]
  ) => {
    return db.createEntityManager().save(chatGameInfo);
  };

  getActiveGame = async (chatId: number) => {
    return db.createEntityManager().findOne(GuessWordGameInfo, {
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
        GuessWordGameInfo,
        { chatId, isFinished: false },
        { isFinished: true }
      );
  };

  saveEntity = (entity: any) => {
    return db.getRepository(GuessWordGameInfo).save(entity);
  };
}

export const guessWordDb = new GuessWordDb();
