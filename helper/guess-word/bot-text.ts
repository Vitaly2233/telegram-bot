export const botReplyText = {
  startGame: (participantsAmount: number, requiredParticipantsAmount: number) =>
    `Гра стартонула, кількість учасників: ${participantsAmount}. Необхідна кількість: ${requiredParticipantsAmount}`,
  startGameWhenGameExists: (username: string) => `Шось питаєшся ноїбать @${username} уже є гра`,
  takePart: () => "Беру участь",
  alreadyPlaying: (username: string) =>
    `Та ти уже граєш, чо лізеш @${username}`,
  newPlayer: (username: string) => `Додався новий гравець: @${username}`,
  enoughPlayers: () => "Всі гравці зібрались, розпочинаємо",
  userInterfering: (username: string) =>
    `Так, тут важна баталія, в якій ти не береш участь, не мішай @${username}`,
  alreadyGuessed: (username: string) =>
    `Ти @${username} уже сказав букву, того жди поки інший назве`,
  guessedRight: () => "Нехуя собі, ще й вгадав",
  guessedWrong: () => "промазав",
  messageWithHiddenWord: (hiddenWord: string, question: string) =>
    `Загадане слово: \n${hiddenWord}\n\nЗапитання: \n${question}`,
  finishResultTitle: () => "Так, ну всьо, наігрались, вот хто виграв:\n",
  finishResultByUser: (listPosition: number, username: string, score: number) =>
    `${listPosition}.@${username} відгадав букв: ${score}`,
};
