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
  private requiredParticipantsAmount = 2;

  data: Record<number, ChatData> = {};

  async handleStartGame(ctx: CommandContext) {
    const chatId = ctx.chat.id;
    if (this.data[chatId]) {
      return ctx.reply(
        botReplyText.startGameWhenGameExists(ctx.message.from.username)
      );
    }

    const participants = [ctx.message.from.username];
    this.data[chatId] = { participants, guesses: [] };

    await ctx.reply(
      botReplyText.startGame(
        participants.length,
        this.requiredParticipantsAmount
      ),
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: botReplyText.takePart(),
                callback_data: CallbackData.TakePart,
              },
            ],
          ],
        },
      }
    );
  }

  async handleUserTakePart(ctx: ActionContext) {
    const username = ctx.from.username;
    const chatId = ctx.chat.id;

    const chatData = this.data[chatId];

    if (!chatData || chatData.participants.includes(username)) {
      return ctx.reply(botReplyText.alreadyPlaying(username));
    }

    chatData.participants.push(username);
    await ctx.reply(botReplyText.newPlayer(username));

    if (chatData.participants.length === this.requiredParticipantsAmount) {
      await ctx.reply(botReplyText.enoughPlayers());
      await ctx.deleteMessage();
      await this.setupStartGame(ctx);
    }
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

  private async setupStartGame(ctx: ActionContext) {
    const { question, wordToGuess } = await this.generateQuestion();
    const chatId = ctx.chat.id;

    const gameMessage = await ctx.reply(
      this.generateMessageWithHiddenWord(wordToGuess, question, [])
    );
    await ctx.pinChatMessage(gameMessage.message_id);

    this.data[chatId].gameMessageId = gameMessage.message_id;
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

    const message = `@${ctx.from.username} відгадав слово: ${chatData.wordToGuess}`;

    await ctx.telegram.unpinChatMessage(chatId, chatData.gameMessageId);
    await ctx.telegram.deleteMessage(chatId, chatData.gameMessageId);
    await ctx.reply(message);

    delete this.data[chatId];
  }

  private async generateQuestion() {
    const wordToGuess = "пизда";
    const question =
      "та шо бля я реально заїбався шукать цей їбучий гпт безплатний";

    return { wordToGuess, question };
  }

  private generateMessageWithHiddenWord(
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
}

export const guessWordGame = new GuessWord();
