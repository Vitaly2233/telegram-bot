import { ChatGameInfo } from "../../entity/chat-game-info";
import { Guess } from "../../entity/guess";
import { botReplyText } from "./bot-text";

export class GuessWord {
  requiredParticipantsAmount = 2;

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

  isUserAlreadyGuessed = (guesses: Guess[], username: string) => {
    const lastGuess = guesses[guesses.length - 1];

    return lastGuess && lastGuess.username === username;
  };

  isWordGuessed = (wordToGuess: string, userWord: string) => {
    return userWord === wordToGuess;
  };
}

export const guessWordGame = new GuessWord();
