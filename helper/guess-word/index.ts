import { Context } from "telegraf";
import { ActionContext, CommandContext } from "../../models/command-context";
import { TextContext } from "../../models/text-context";
import {
  CallbackData,
  ChatData,
  Guess,
  UserScore,
} from "../../models/word-game";
import { botReplyText } from "./bot-text";

export class GuessWord {
  requiredParticipantsAmount = 2;

  data: Record<number, ChatData> = {};

  async handleFinishGame(ctx: Context) {
    const chatId = ctx.chat.id;
    if (!this.data[chatId]) return ctx.reply("Та нема що видаляти");

    await ctx.deleteMessage();

    delete this.data[chatId];
    await ctx.reply(botReplyText.finishGame(ctx.from.username));
  }

  async handleUserSentWord(ctx: TextContext) {
    const messageText = ctx.message.text;

    const username = ctx.message.from.username;
    const chatId = ctx.chat.id;
    const chatData = this.data[chatId];

    if (!chatData) return;

    if (!chatData.participants?.includes(username)) {
      return ctx.reply(botReplyText.userInterfering(), {
        reply_to_message_id: ctx.message.message_id,
      });
    }

    if (!chatData.guesses) chatData.guesses = [];

    const isGameFinished = await this.processUserGuess(
      ctx,
      messageText,
      username,
      chatData
    );

    if (!isGameFinished) return;
    await this.finishGame(ctx);
  }

  async setupStartGame(
    chatId: number,
    messageId: number,
    wordToGuess: string,
    question: string
  ) {
    this.data[chatId].gameMessageId = messageId;
    this.data[chatId].question = question;
    this.data[chatId].wordToGuess = wordToGuess;
  }

  private async processUserGuess(
    ctx: Context,
    text: string,
    username: string,
    chatData: ChatData
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

  isEnoughPlayers(chatId: number) {
    return (
      this.data[chatId].participants.length === this.requiredParticipantsAmount
    );
  }

  isUserTakingPart(chatId: number, username: string) {
    return (
      this.data[chatId] && this.data[chatId].participants.includes(username)
    );
  }

  addNewPlayer(chatId: number, username: string) {
    this.data[chatId].participants.push(username);
  }

  getChatById(chatId: number) {
    return this.data[chatId];
  }

  setChatParticipants(chatId: number, participants: string[]) {
    this.data[chatId].participants = participants;
  }

  setChatGuesses(chatId: number, guesses: Guess[]) {
    this.data[chatId].guesses = guesses;
  }

  deleteChat(chatId: number) {
    delete this.data[chatId];
  }

  updateChatData(chatId: number, chatData: ChatData) {
    this.data[chatId] = chatData;
  }
}

export const guessWordGame = new GuessWord();
