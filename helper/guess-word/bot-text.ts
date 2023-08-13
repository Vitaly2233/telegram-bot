export const botReplyText = {
  startGame: (participantsAmount: number, requiredParticipantsAmount: number) =>
    `Гра стартонула, кількість учасників: ${participantsAmount}. Необхідна кількість: ${requiredParticipantsAmount}`,
  finishGame: (username: string) => `Гравець @${username} відмінив гру`,
  nothingToFinish: () => 'Та нема що зупиняти',
  startGameWhenGameExists: (username: string) =>
    `Шось питаєшся ноїбать @${username} уже є гра`,
  takePart: () => "Беру участь",
  alreadyPlaying: (username: string) =>
    `Та ти уже граєш, чо лізеш @${username}`,
  newPlayer: (username: string) => `Додався новий гравець: @${username}`,
  enoughPlayers: () => "Всі гравці зібрались, розпочинаємо",
  userInterfering: () => `Не мішай`,
  alreadyGuessed: (username: string) =>
    `Ти @${username} уже сказав букву, того жди поки інший назве`,
  guessedRight: () => "Нехуя собі, ще й вгадав",
  guessedWrong: () => "промазав",
  messageWithHiddenWord: (hiddenWord: string, question: string) =>
    `Загадане слово: \n${hiddenWord}\n\nЗапитання: \n${question}`,
  gameFinished: (username: string, wordToGuess: string) => `@${username} відгадав слово: ${wordToGuess}`
};
