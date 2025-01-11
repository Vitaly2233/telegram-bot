export const isInvalidMessageText = (message: string) => {
  const lowercased = message.toLowerCase();

  const filterWords = ["give up"];

  return filterWords.some((item) => lowercased.includes(item));
};
