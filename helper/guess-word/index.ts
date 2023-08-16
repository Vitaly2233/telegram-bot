import { Context } from "telegraf";
import { ChatGameInfo } from "../../entity/chat-game-info";
import { Guess } from "../../entity/guess";
import { TextContext } from "../../models/text-context";
import { botReplyText } from "./bot-text";

export class GuessWord {
  requiredParticipantsAmount = 2;

  data: Record<number, ChatGameInfo> = {};

  async handleFinishGame(ctx: Context) {
    const chatId = ctx.chat.id;
    if (!this.data[chatId]) return ctx.reply("Та нема що видаляти");

    await ctx.deleteMessage();

    delete this.data[chatId];
    await ctx.reply(botReplyText.finishGame(ctx.from.username));
  }

  private async processUserGuess(
    ctx: Context,
    text: string,
    username: string,
    chatData: ChatGameInfo
  ): Promise<Boolean> {
    const { guesses, wordToGuess } = chatData;
    const lastGuess = guesses[guesses.length - 1];

    if (lastGuess && lastGuess.username === username) {
      await ctx.reply(botReplyText.alreadyGuessed(ctx.message.from.username));
      return false;
    }

    const newGuess: Guess = {
      text,
      username,
    };
    chatData.guesses.push(newGuess);

    if (newGuess.text === wordToGuess) return true;

    const newMessage = this.generateMessageWithHiddenWord(
      chatData.wordToGuess,
      chatData.question,
      chatData.guesses
    );

    try {
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        chatData.gameMessageId,
        "_",
        newMessage
      );
    } catch (err) {}

    return false;
  }

  private async finishGame(ctx: Context) {
    const chatId = ctx.chat.id;
    const chatData = this.data[chatId];
    const message = botReplyText.gameFinished(
      ctx.from.username,
      chatData.wordToGuess
    );

    await ctx.telegram.unpinChatMessage(chatId, chatData.gameMessageId);
    await ctx.telegram.deleteMessage(chatId, chatData.gameMessageId);
    await ctx.reply(message);

    delete this.data[chatId];
  }

  async generateQuestion() {
    const wordToGuess = "пизда";
    const question =
      "та шо бля я реально заїбався шукать цей їбучий гпт безплатний";

    return { wordToGuess, question };
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

  isEnoughPlayers(chat: ChatGameInfo, toAdd?: number) {
    let participantsAmount = chat.participants.length;
    if (toAdd) participantsAmount += toAdd;
    return participantsAmount >= this.requiredParticipantsAmount;
  }

  isUserTakingPart(chat: ChatGameInfo, username: string) {
    return chat.participants?.includes(username);
  }
}

export const guessWordGame = new GuessWord();
