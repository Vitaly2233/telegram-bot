import { Context, NarrowedContext } from "telegraf";
import {
  CallbackQuery,
  Message,
  Update,
} from "telegraf/typings/core/types/typegram";

export type CommandContext = NarrowedContext<
  Context<Update>,
  {
    message: Update.New & Update.NonChannel & Message.TextMessage;
    update_id: number;
  }
>;

export type ActionContext = NarrowedContext<
  Context<Update> & {
    match: RegExpExecArray;
  },
  Update.CallbackQueryUpdate<CallbackQuery>
>;
