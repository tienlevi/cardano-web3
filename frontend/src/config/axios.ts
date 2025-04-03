import axios from "axios";
import { blockfrostApiKey, blockfrostPreviewApi } from "@/constants";

export const instanceBlockfrost = axios.create({
  baseURL: blockfrostPreviewApi,
  headers: {
    Project_id: blockfrostApiKey,
  },
});
