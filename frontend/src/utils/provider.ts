import { BlockfrostProvider } from "@meshsdk/core";
import { blockfrostApiKey } from "../constants";

export const provider = new BlockfrostProvider(blockfrostApiKey);
