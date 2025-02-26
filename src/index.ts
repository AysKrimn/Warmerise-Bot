import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import loadApplicationFiles from "./loader/app";
import config from "./config";
import deployCommands from "./loader/interactionCommands";

export interface WarmeriseDcApp extends Client {
  commands: Collection<string, any>;
}
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
}) as WarmeriseDcApp;

client.commands = new Collection();

client
  .login(config.app.token)
  .then(async () => {
    await loadApplicationFiles(client);
    await deployCommands(client.commands);
  })
  .catch((err) => {
    console.error(err);
  });
