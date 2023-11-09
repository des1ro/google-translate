export type JSONObject<T> = { [key: string]: JSONObject<T> | T };
