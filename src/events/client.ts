import { Client, Events } from "discord.js";
import debug from "../utils/debug";

export default {
  name: Events.ClientReady,
  async execute(client: Client) {
    debug(`App started as ${client.user?.username}`);
  },
};
