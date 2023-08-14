import { Context } from "telegraf";
import { ChatGameInfo } from "../../entity/chat-game-info";
import { guessWordGame } from "../../helper/guess-word";
import { botReplyText } from "../../helper/guess-word/bot-text";
import { guessWordDb } from "../../helper/guess-word/guess-word-db";
import { ActionContext } from "../../models/command-context";
import { TextContext } from "../../models/text-context";
import { CallbackData } from "../../models/word-game";

export const handleStartGame = async (ctx: Context) => {
  const chatId = ctx.chat.id;
  const participants = [ctx.message.from.username];

  const chatInfo = await guessWordDb.getActiveGame(chatId);

  if (chatInfo) {
    return ctx.reply(
      botReplyText.startGameWhenGameExists(ctx.message.from.username)
    );
  }

  const chatGame = new ChatGameInfo();
  chatGame.participants = [];
  chatGame.guesses = [];
  chatGame.chatId = chatId;

  await Promise.all([
    guessWordDb.createChatGame(chatGame),
    ctx.reply(
      botReplyText.startGame(
        participants.length,
        guessWordGame.requiredParticipantsAmount
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
    ),
  ]);
};

export const handleFinishGame = async (ctx: Context) => {
  const chatId = ctx.chat.id;

  const chatInfo = await guessWordDb.getActiveGame(chatId);

  if (!chatInfo) return ctx.reply(botReplyText.nothingToFinish());

  guessWordGame.deleteChat(chatId);

  await Promise.all([
    ctx.deleteMessage(),
    ctx.reply(botReplyText.finishGame(ctx.from.username)),
  ]);
};

export const handleUserTakePart = async (ctx: ActionContext) => {
  const username = ctx.from.username;
  const chatId = ctx.chat.id;

  if (guessWordGame.isPlayerTakingPart(chatId, username)) {
    return ctx.reply(botReplyText.alreadyPlaying(username));
  }

  guessWordGame.addNewPlayer(chatId, username);

  await ctx.reply(botReplyText.newPlayer(username));

  if (guessWordGame.isEnoughPlayers(chatId)) {
    await Promise.all([
      ctx.reply(botReplyText.enoughPlayers()),
      ctx.deleteMessage(),
    ]);

    const { question, wordToGuess } = await guessWordGame.generateQuestion();

    const gameMessage = await ctx.reply(
      guessWordGame.generateMessageWithHiddenWord(wordToGuess, question, [])
    );

    await ctx.pinChatMessage(gameMessage.message_id);
    guessWordGame.setupStartGame(
      chatId,
      gameMessage.message_id,
      wordToGuess,
      question
    );
  }
};
