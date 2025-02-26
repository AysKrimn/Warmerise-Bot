import path from "path";
import fs from "fs";
import debug from "./debug";
import { WarmeriseDcApp } from "../index";

const loadContent = async (client: WarmeriseDcApp, isCommands: boolean) => {
  const contentPath = isCommands ? "../commands" : "../events";
  const folderPath = path.join(__dirname, contentPath);

  // Check if the directory exists
  if (!fs.existsSync(folderPath)) {
    console.error(`Directory not found: ${folderPath}`);
    return;
  }

  const contentFiles = fs
    .readdirSync(folderPath)
    .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

  for (const file of contentFiles) {
    const filePath = path.join(folderPath, file);
    const { default: content } = await import(filePath);

    if (isCommands && "data" in content && "execute" in content) {
      client.commands.set(content.data.name, content);
      debug(`Loaded command: ${content.data.name}`);
    } else if (!isCommands && "name" in content) {
      client.on(content.name, content.execute);
      debug(`Loaded event: ${content.name}`);
    } else {
      console.log(
        `[WARNING] The content at ${filePath} is missing a required "data" or "name" property.`
      );
    }
  }
};

export default loadContent;
