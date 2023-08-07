import { ai } from "../../helper/ai";
import { botApi } from "../../helper/bot";
import { ActionContext, CommandContext } from "../../models/command-context";
import { TextContext } from "../../models/text-context";
import { CallbackData } from "../../models/word-game";

interface Guess {
  userId: number;
  letter: string;
}

const data: Record<
  number,
  {
    participants: number[];
    guesses: Guess[];
    wordToGuess?: string;
    question?: string;
  }
> = {};

const requiredParticipantsAmount = 2;

export const startWordGame = async (ctx: CommandContext) => {
  const chatId = ctx.chat.id;
  if (data[chatId])
    return ctx.reply(
      `Шось питаєшся ноїбать @${ctx.message.from.username} уже є гра`
    );

  const participants = [ctx.message.from.id];
  data[chatId] = { participants, guesses: [] };
  await ctx.reply(
    `Гра стартонула, кількість учасників: ${participants.length}. Необхідна кількість: ${requiredParticipantsAmount}`,
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
};

export const takePart = async (ctx: ActionContext) => {
  const userId = ctx.from.id;
  const username = ctx.from.username;
  const chatId = ctx.chat.id;

  const chatData = data[chatId];

  if (!chatData || chatData.participants.includes(userId)) {
    return ctx.reply(`Та ти уже граєш, чо лізеш @${username}`);
  }

  chatData.participants.push(userId);
  await ctx.reply(`Додався новий гравець: @${username}`);

  if (chatData.participants.length === requiredParticipantsAmount) {
    await ctx.reply("Ну всі гравці зібрались, розпочинаємо");
    await ctx.deleteMessage();
    await setupGame(ctx);
  }
};

export const handleSendWord = async (ctx: TextContext) => {
  const messageText = ctx.message.text;
  if (messageText.length !== 1) return;

  const userId = ctx.message.from.id;
  const chatId = ctx.chat.id;

  if (!data[chatId]) return;

  if (!data[chatId]?.participants?.includes(userId)) {
    return ctx.reply(
      `Так, тут важна баталія, в якій ти не береш участь, не мішай @${ctx.message.from.username}`
    );
  }

  if (!data[chatId].guesses) data[chatId].guesses = [];

  const guesses = data[chatId].guesses;
  if (guesses.length === 0) {
    guesses.push({ letter: messageText, userId });
  } else {
    const lastGuess = guesses[guesses.length - 1];
    if (lastGuess.userId !== userId) {
      await ctx.reply(
        `Ти @${ctx.message.from.username} уже сказав букву, того жди поки інший назве`
      );
    }

    //TODO add logic for adding guesses for data
  }
};

const setupGame = async (ctx: ActionContext) => {
  const { question, wordToGuess } = await generateGameQuestion();
  const chatId = ctx.chat.id;

  const gameMessage = await ctx.reply(
    generateGameMessage(wordToGuess, question, [])
  );
  await ctx.pinChatMessage(gameMessage.message_id);

  data[chatId].question = question;
  data[chatId].wordToGuess = wordToGuess;
};

const generateGameQuestion = async () => {
  const wordToGuess = "пизда";
  const question =
    "та шо бля я реально заїбався шукать цей їбучий гпт безплатний";

  return { wordToGuess, question };
};

const generateGuess = async (
  allGuesses: Guess[],
  userId: number,
  text: string,
  ctx: TextContext
) => {
  const lastGuess = allGuesses[allGuesses.length - 1];

  if (lastGuess.userId === userId) {
    await ctx.reply(
      `Ти @${ctx.message.from.username} уже сказав букву, того жди поки інший назве`
    );
  }
};

const hideWord = (word: string, letters: string[]) => {
  return word
    .split("")
    .map((letter) => (letters.includes(letter) ? letter : "*"))
    .join("  ");
};

const generateGameMessage = (
  wordToGuess: string,
  question: string,
  guesses: Guess[]
) => {
  const letters = guesses.map((guess) => guess.letter);

  return `Загадане слово: \n${hideWord(
    wordToGuess,
    letters
  )}\n\nЗапитання: \n${question}`;
};
