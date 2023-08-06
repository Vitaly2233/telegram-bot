export const newChatMember = async (ctx: any) => {
  await ctx.reply("Опа, новий підор пришов");
};

export const leftChatMember = async (ctx: any) => {
  await ctx.reply("Ну і пашол нахуй");
};
