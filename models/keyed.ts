import { Deunionize, UnionKeys } from "telegraf/typings/deunionize";

type DistinctKeys<T extends object> = Exclude<UnionKeys<T>, keyof T>;

export type Keyed<T extends object, K extends DistinctKeys<T>> = Record<K, {}> &
  Deunionize<Record<K, {}>, T>;
