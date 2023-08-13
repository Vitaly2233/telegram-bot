import { externalApi } from "../../helper/external-api";
import { CommandContext } from "../../models/command-context";

export const getNews = async (ctx: CommandContext) => {
  const deepStateResult = await externalApi.getDeepStateLatestUpdate();
  const messageId = ctx.message.message_id;

  await ctx.reply(`DeepState update:\n${deepStateResult.description}`, {
    reply_to_message_id: messageId,
  });
};
