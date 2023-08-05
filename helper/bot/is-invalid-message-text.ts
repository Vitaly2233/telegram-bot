export const isInvalidMessageText = (message: string) => {
  const lowercased = message.toLowerCase();

  const filterWords = ["блять", "сука", "нахуй"];

  return filterWords.some((item) => lowercased.includes(item));
};
