import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

import * as cheerio from "cheerio";
import config, { cookie } from "../config";
import User from "../structures/User";
import { UserEmbed } from "../embed/UserEmbed";
import { FailureCodes } from "../constants";

const command = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Information about the player")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("The username of the player")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("stats")
        .setDescription("Yearly or all time stats of the player")
        .setRequired(true)
        .addChoices(
          { name: "This Year", value: "this_y" },
          { name: "All Time", value: "all_t" }
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply();

      let query = "";
      let username = interaction.options.getString("username");

      if (!username) {
        return interaction.editReply("Please provide a valid username or URL.");
      }

      const isUrl = username.startsWith("https");
      const whichYear = interaction.options.getString("stats");

      whichYear === "this_y" ? (query = "this_year") : (query = "all_time");

      if (isUrl) {
        const parseUrl = username.split("/");
        const profileName = parseUrl[parseUrl.length - 1];
        username = profileName;
      }

      const path = `${config.warmerise.urls.profile}/${username}`;
      const url = encodeURI(path);

      const request = await fetch(url, {
        headers: {
          Cookie: cookie,
        },
      });

      if (request.status === 403) {
        return interaction.editReply({ content: FailureCodes.forbidden });
      }

      if (request.status === 404) {
        return interaction.editReply({ content: FailureCodes.notFound });
      }

      if (!request.ok) {
        return interaction.editReply({ content: FailureCodes.internal });
      }

      const data = await request.text();
      // debug("Data fetched from Warmerise", data);
      const $ = cheerio.load(data);

      const user = new User($, username, query);

      if (user.isBlank()) {
        return interaction.editReply({
          content: `${FailureCodes.internal} e-tag: ERR-SESSION-1`,
        });
      }
      user.getStats();

      const embed = new UserEmbed(user).build();
      const displayURL = Number(username)
        ? `${url} (${user.getProfileName()})`
        : url;

      interaction.editReply({ content: displayURL, embeds: [embed] });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};

export default command;
