import { Context } from "telegraf";
import { ChatGameInfo } from "../../entity/chat-game-info";
import { Guess } from "../../entity/guess";
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

  await Promise.all([
    guessWordDb.finishGame(chatId),
    ctx.deleteMessage(),
    ctx.reply(botReplyText.finishGame(ctx.from.username)),
  ]);
};

export const handleUserTakePart = async (ctx: ActionContext) => {
  const chatId = ctx.chat.id;
  const username = ctx.from.username;

  const isUserPlaying = await guessWordDb.isUserTakingPart(username);
  if (isUserPlaying) {
    return ctx.reply(botReplyText.alreadyPlaying(username));
  }

  const [chatInfo] = await Promise.all([
    guessWordDb.getActiveGame(chatId),
    guessWordDb.addUserToGame(chatId, username),
    ctx.reply(botReplyText.newPlayer(username)),
  ]);

  if (!guessWordGame.isEnoughPlayers(chatInfo)) return;

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
    guessWordDb.setupStartGame(
      chatId,
      gameMessage.message_id,
      wordToGuess,
      question
    ),
  ]);
};

export const handleUserSendWord = async (ctx: TextContext) => {
  const messageText = ctx.message.text;
  const username = ctx.message.from.username;
  const chatId = ctx.chat.id;

  const newGuess = new Guess();
  newGuess.text = messageText;
  newGuess.username = username;

  const gameData = await guessWordDb.getActiveGame(chatId);
  if (!gameData) return;

  const isUserPlaying = guessWordGame.isUserTakingPart(gameData, username);
  if (!isUserPlaying) {
    return ctx.reply(botReplyText.userInterfering(), {
      reply_to_message_id: ctx.message.message_id,
    });
  }

  const { guesses, wordToGuess } = gameData;
  if (guessWordGame.isUserAlreadyGuessed(guesses, username)) {
    return ctx.reply(botReplyText.alreadyGuessed(ctx.message.from.username));
  }

  gameData.guesses.push(newGuess);
  await guessWordDb.saveEntity(gameData);

  if (guessWordGame.isWordGuessed(newGuess.text, wordToGuess)) {
    const message = botReplyText.gameFinished(
      ctx.from.username,
      gameData.wordToGuess
    );

    return Promise.all([
      ctx.telegram.unpinChatMessage(chatId, gameData.gameMessageId),
      ctx.telegram.deleteMessage(chatId, gameData.gameMessageId),
      ctx.reply(message),
      guessWordDb.finishGame(chatId),
    ]);
  } else {
    const newMessage = guessWordGame.generateMessageWithHiddenWord(
      gameData.wordToGuess,
      gameData.question,
      gameData.guesses
    );

    try {
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        gameData.gameMessageId,
        "_",
        newMessage
      );
    } catch (err) {}
  }
};
