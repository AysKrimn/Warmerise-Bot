import { REST, Routes, Collection } from "discord.js";
import debug from "../utils/debug";
import config from "../config";

async function deployCommands(commands: Collection<string, any>) {
  const commansAsJSON = commands.map((cmd) => {
    if (!cmd.data || typeof cmd.data.toJSON !== "function") {
      throw new Error(
        `Command ${
          cmd?.data?.name || "UNKNOWN"
        } is missing required data or toJSON method`
      );
    }
    return cmd.data.toJSON();
  });
  try {
    const rest = new REST().setToken(config.app.token);
    await rest.put(Routes.applicationCommands(config.app.clientId), {
      body: commansAsJSON,
    });
    debug(`Successfully deployed or patched ${commansAsJSON.length} commands`);
  } catch (error) {
    console.error("Error deploying commands:", error);
    throw error;
  }
}

// if (require.main === module) {
//   deployCommands().catch(console.error);
// }

export default deployCommands;
