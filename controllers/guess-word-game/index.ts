import { Context } from "telegraf";
import { guessWordGame } from "../../helper/guess-word";
import { botReplyText } from "../../helper/guess-word/bot-text";
import { ActionContext } from "../../models/command-context";
import { TextContext } from "../../models/text-context";
import { CallbackData } from "../../models/word-game";

export const handleStartGame = async (ctx: Context) => {
  const chatId = ctx.chat.id;
  const participants = [ctx.message.from.username];

  const chatInfo = await guessWordGame.getActiveGame(chatId);

  if (chatInfo) {
    return ctx.reply(
      botReplyText.startGameWhenGameExists(ctx.message.from.username)
    );
  }

  await Promise.all([
    guessWordGame.createChatGame(participants, chatId),
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

  const chatInfo = await guessWordGame.getActiveGame(chatId);

  if (!chatInfo) return ctx.reply(botReplyText.nothingToFinish());

  await Promise.all([
    guessWordGame.finishGame(chatId),
    ctx.deleteMessage(),
    ctx.reply(botReplyText.finishGame(ctx.from.username)),
  ]);
};

export const handleUserTakePart = async (ctx: ActionContext) => {
  const chatId = ctx.chat.id;
  const username = ctx.from.username;

  const game = await guessWordGame.getActiveGame(chatId);
  const isUserTakingPart = guessWordGame.isUserTakingPart(game, username);
  if (isUserTakingPart) {
    return ctx.reply(botReplyText.alreadyPlaying(username));
  }

  await Promise.all([
    guessWordGame.addParticipantToGame(game, username),
    ctx.reply(botReplyText.newPlayer(username)),
  ]);

  if (!guessWordGame.isEnoughPlayers(game)) return;

  await Promise.all([
    ctx.reply(botReplyText.enoughPlayers()),
    ctx.deleteMessage(),
  ]);

  const { question, wordToGuess } = await guessWordGame.generateQuestion();
  const gameMessage = await ctx.reply(
    guessWordGame.generateMessageWithHiddenWord(wordToGuess, question, [])
  );

  await Promise.all([
    ctx.pinChatMessage(gameMessage.message_id),
    guessWordGame.setupStartGame(
      game,
      question,
      wordToGuess,
      gameMessage.message_id
    ),
  ]);
};

export const handleUserSendWord = async (ctx: TextContext) => {
  const messageText = ctx.message.text;
  const username = ctx.message.from.username;
  const chatId = ctx.chat.id;

  const game = await guessWordGame.getActiveGame(chatId);
  if (!game) return;

  const isUserPlaying = guessWordGame.isUserTakingPart(game, username);
  if (!isUserPlaying) {
    return ctx.reply(botReplyText.userInterfering(), {
      reply_to_message_id: ctx.message.message_id,
    });
  }

  const { guesses, wordToGuess } = game;
  if (guessWordGame.isUserAlreadyGuessed(guesses, username)) {
    return ctx.reply(botReplyText.alreadyGuessed(ctx.message.from.username));
  }
  if (!game.guesses) game.guesses = [];

  const newGuess = await guessWordGame.makeGuessForGame(
    game,
    messageText,
    username
  );

  if (guessWordGame.isWordGuessed(newGuess.text, wordToGuess)) {
    const message = botReplyText.gameFinished(
      ctx.from.username,
      game.wordToGuess
    );

    return Promise.all([
      ctx.telegram.unpinChatMessage(chatId, game.gameMessageId),
      ctx.telegram.deleteMessage(chatId, game.gameMessageId),
      ctx.reply(message),
      guessWordGame.finishGame(chatId),
    ]);
  } else {
    const newMessage = guessWordGame.generateMessageWithHiddenWord(
      game.wordToGuess,
      game.question,
      game.guesses
    );
    const botMessage = botReplyText.guessedRight();

    try {
      await Promise.all([
        ctx.reply(botMessage),
        ctx.telegram.editMessageText(
          ctx.chat.id,
          game.gameMessageId,
          "_",
          newMessage
        ),
      ]);
    } catch (err) {}
  }
};
