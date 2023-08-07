import { Context } from "telegraf";
import { ActionContext, CommandContext } from "../../models/command-context";
import { TextContext } from "../../models/text-context";
import { CallbackData } from "../../models/word-game";

interface Guess {
  username: string;
  letter: string;
}

interface ChatData {
  participants: string[];
  guesses: Guess[];
  wordToGuess?: string;
  question?: string;
  gameMessageId?: number;
}

interface UserScore {
  username: string;
  score: number;
}

export class GuessWord {
  private requiredParticipantsAmount = 2;

  data: Record<number, ChatData> = {};

  constructor() {}

  async handleStartGame(ctx: CommandContext) {
    const chatId = ctx.chat.id;
    if (this.data[chatId])
      return ctx.reply(
        `Шось питаєшся ноїбать @${ctx.message.from.username} уже є гра`
      );

    const participants = [ctx.message.from.username];
    this.data[chatId] = { participants, guesses: [] };
    await ctx.reply(
      `Гра стартонула, кількість учасників: ${participants.length}. Необхідна кількість: ${this.requiredParticipantsAmount}`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Беру участь",
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
      return ctx.reply(`Та ти уже граєш, чо лізеш @${username}`);
    }

    chatData.participants.push(username);
    await ctx.reply(`Додався новий гравець: @${username}`);

    if (chatData.participants.length === this.requiredParticipantsAmount) {
      await ctx.reply("Ну всі гравці зібрались, розпочинаємо");
      await ctx.deleteMessage();
      await this.setupStartGame(ctx);
    }
  }

  async handleUserSentWord(ctx: TextContext) {
    const messageText = ctx.message.text;
    if (messageText.length !== 1) return;

    const username = ctx.message.from.username;
    const chatId = ctx.chat.id;

    if (!this.data[chatId]) return;

    if (!this.data[chatId]?.participants?.includes(username)) {
      return ctx.reply(
        `Так, тут важна баталія, в якій ти не береш участь, не мішай @${ctx.message.from.username}`
      );
    }

    if (!this.data[chatId].guesses) this.data[chatId].guesses = [];

    await this.processUserGuess(ctx, messageText, username, this.data[chatId]);

    const isGameFinished = this.isGameFinished(
      this.data[chatId].guesses,
      this.data[chatId].wordToGuess
    );
    if (!isGameFinished) return;
    await this.finishGame(
      ctx,
      this.data[chatId].guesses,
      this.data[chatId].wordToGuess
    );
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
  ) {
    const { guesses } = chatData;
    const lastGuess = guesses[guesses.length - 1];

    if (lastGuess && lastGuess.username === username) {
      return ctx.reply(
        `Ти @${ctx.message.from.username} уже сказав букву, того жди поки інший назве`
      );
    }

    const newGuess: Guess = {
      letter: text,
      username,
    };
    chatData.guesses.push(newGuess);

    const newMessage = this.generateMessageWithHiddenWord(
      chatData.wordToGuess,
      chatData.question,
      chatData.guesses
    );

    try {
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        chatData.gameMessageId,
        "123",
        newMessage
      );
      await ctx.reply(`Нехуя собі, ще й вгадав`, {
        reply_to_message_id: ctx.message.message_id,
      });
    } catch (err) {
      if (err.message.includes("message is not modified")) {
        await ctx.reply(`промазав`, {
          reply_to_message_id: ctx.message.message_id,
        });
      }
    }
  }

  private async finishGame(
    ctx: Context,
    guesses: Guess[],
    wordToGuess: string
  ) {
    const chatId = ctx.chat.id;
    const chatData = this.data[chatId];
    const score = this.calculateScoreByPlayer(guesses, wordToGuess);

    const message = this.generateFinalScoreTable(score);
    await ctx.telegram.unpinChatMessage(chatId, chatData.gameMessageId);
    await ctx.telegram.deleteMessage(chatId, chatData.gameMessageId);
    await ctx.reply(message);
    delete this.data[chatId];
  }

  isGameFinished(guesses: Guess[], wordToGuess: string) {
    const guessedLetters = guesses.map((guess) => guess.letter);

    return !wordToGuess
      .split("")
      .some((char) => !guessedLetters.find((guess) => guess === char));
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
    const letters = guesses.map((guess) => guess.letter);

    return `Загадане слово: \n${this.hideWord(
      wordToGuess,
      letters
    )}\n\nЗапитання: \n${question}`;
  }

  private hideWord(word: string, letters: string[]) {
    return word
      .split("")
      .map((letter) => (letters.includes(letter) ? letter : "*"))
      .join("  ");
  }

  private calculateScoreByPlayer(guesses: Guess[], wordToGuess: string) {
    return guesses.reduce((acc, guess) => {
      if (!wordToGuess.includes(guess.letter)) return acc;

      const scoreIndex = acc.findIndex(
        (res) => res.username === guess.username
      );

      if (scoreIndex === -1) {
        acc.push({ score: 1, username: guess.username });
      } else {
        acc[scoreIndex].score += 1;
      }

      return acc;
    }, [] as UserScore[]);
  }

  private generateFinalScoreTable(userScore: UserScore[]) {
    const sorted = userScore.sort((a, b) => b.score - a.score);
    return `Так, ну всьо, наігрались, вот хто виграв:\n${sorted
      .map((score, index) => {
        return `${index + 1}.@${score.username} відгадав букв: ${score.score}`;
      })
      .join("\n")}`;
  }
}

export const guessWordGame = new GuessWord();
