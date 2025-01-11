import { GuessWordGameInfo } from "../../entity/guess-wordd-game-info";
import { Guess } from "../../entity/guess";
import { db } from "../db";
import { botReplyText } from "./bot-text";
import { guessWordDb } from "./guess-word-db";

export class GuessWordGame {
  requiredParticipantsAmount = 2;
  private repository = db.getRepository(GuessWordGameInfo);

  async generateQuestion() {
    const wordToGuess = "word to guess";
    const question =
      "question";

    return { wordToGuess, question };
  }

  getActiveGame(chatId: number) {
    return guessWordDb.getActiveGame(chatId);
  }

  createChatGame(participants: string[], chatId: number) {
    const chatGame = new GuessWordGameInfo();
    chatGame.participants = participants;
    chatGame.chatId = chatId;

    return guessWordDb.createChatGame(chatGame);
  }

  finishGame(chatId: number) {
    return guessWordDb.finishGame(chatId);
  }

  addParticipantToGame(game: GuessWordGameInfo, participant: string) {
    game.participants.push(participant);
    return guessWordDb.saveEntity(game);
  }

  setupStartGame(
    game: GuessWordGameInfo,
    question: string,
    wordToGuess: string,
    gameMessageId: number
  ) {
    game.question = question;
    game.wordToGuess = wordToGuess;
    game.gameMessageId = gameMessageId;

    return guessWordDb.saveEntity(game);
  }

  async makeGuessForGame(
    game: GuessWordGameInfo,
    messageText: string,
    username: string
  ) {
    const newGuess = new Guess();
    newGuess.text = messageText;
    newGuess.username = username;
    const savedGuess = await gameGuess.saveGuess(newGuess);

    game.guesses.push(newGuess);
    await guessWordDb.saveEntity(game);

    return savedGuess;
  }

  generateMessageWithHiddenWord(
    wordToGuess: string,
    question: string,
    guesses: Guess[]
  ) {
    const guessedLetters = guesses.map((guess) => guess.text);

    return botReplyText.messageWithHiddenWord(
      this.hideWord(wordToGuess, guessedLetters),
      question
    );
  }

  private hideWord(word: string, guessedText: string[]) {
    const guessedWords = guessedText.filter((text) => text.length === 1);

    return word
      .split("")
      .map((letter) => (guessedWords.includes(letter) ? letter : "*"))
      .join("  ");
  }

  isEnoughPlayers(chat: GuessWordGameInfo, toAdd?: number) {
    let participantsAmount = chat.participants.length;
    if (toAdd) participantsAmount += toAdd;
    return participantsAmount >= this.requiredParticipantsAmount;
  }

  isUserTakingPart(chat: GuessWordGameInfo, username: string) {
    return chat.participants?.includes(username);
  }

  isUserAlreadyGuessed = (guesses: Guess[], username: string) => {
    if (!guesses) return false;
    const lastGuess = guesses[guesses.length - 1];

    return lastGuess && lastGuess.username === username;
  };

  isWordGuessed = (wordToGuess: string, userWord: string) => {
    return userWord === wordToGuess;
  };
}

class GameGuess {
  private repository = db.getRepository(Guess);

  saveGuess(guess: Guess) {
    return this.repository.save(guess);
  }
}

export const guessWordGame = new GuessWordGame();
export const gameGuess = new GameGuess();
