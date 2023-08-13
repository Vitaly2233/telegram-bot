import { CronJob } from "cron";
import { notifyFlatChats } from "../controllers";
import { Bot } from "../models/bot";

export const setupCronJobs = (bot: Bot) => {
  const job = new CronJob("*/5 * * * *", async () => {
    await notifyFlatChats(bot);
  });

  job.start();
};
