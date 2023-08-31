import { botApi } from "./helper/bot";


process.once("SIGINT", () => botApi.stop("SIGINT"));
process.once("SIGTERM", () => botApi.stop("SIGTERM"));
