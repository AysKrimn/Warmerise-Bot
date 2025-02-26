import { Collection } from "discord.js";
import loadContent from "../utils/loadContent";
import { WarmeriseDcApp } from "..";

const loadApplicationFiles = async (client: WarmeriseDcApp) => {
  await loadContent(client, true);
  await loadContent(client, false);
};
export default loadApplicationFiles;
