import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
} from "discord.js";
import MatchMaking from "../structures/MatchMaking";
import { MatchmakingEmbed } from "../embed/MatchmakingEmbed";

const command = {
  data: new SlashCommandBuilder()
    .setName("roomlist")
    .setDescription("Room list of the server"),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply();

      const matchMaking = new MatchMaking();
      const matchmakingData = await matchMaking.getMatchMakingData();

      if (!matchmakingData) {
        return interaction.editReply("Failed to fetch server list");
      }

      const embed = new MatchmakingEmbed(matchMaking).build();

      return interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Error in roomlist command:", error);
      return interaction.editReply({
        content: "Something went wrong please try again later",
      });
    }
  },
};

export default command;
