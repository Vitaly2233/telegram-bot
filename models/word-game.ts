export enum CallbackData {
  TakePart = "word_game/take-part",
}

export interface Guess {
  username: string;
  letter: string;
}

export interface ChatData {
  participants: string[];
  guesses: Guess[];
  wordToGuess?: string;
  question?: string;
  gameMessageId?: number;
}

export interface UserScore {
  username: string;
  score: number;
}
