import { Context, NarrowedContext } from "telegraf";
import { Message, Update } from "telegraf/typings/core/types/typegram";
import { Keyed } from "./keyed";

export type TextContext = NarrowedContext<
  Context<Update>,
  Update.MessageUpdate<Keyed<Message, "text">>
>;
