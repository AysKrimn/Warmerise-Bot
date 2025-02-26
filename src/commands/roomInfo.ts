import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import RoomInfo from "../structures/RoomInfo";
import { RoomInfoEmbed } from "../embed/RoomInfoEmbed";

const command = {
  data: new SlashCommandBuilder()
    .setName("roominfo")
    .setDescription("Information about the room")
    .addStringOption((option) =>
      option
        .setName("roomname")
        .setDescription("The name of the room")
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply();

      const roomName = interaction.options.getString("roomname");

      if (!roomName) {
        return interaction.editReply("Please provide a valid room name");
      }

      const roomInfo = new RoomInfo();
      await roomInfo.getMatchMakingData();
      const room = roomInfo.getRoom(roomName);

      if (!room) {
        return interaction.editReply("Room not found");
      }

      console.log("find room:", room);

      return interaction.editReply({
        embeds: [new RoomInfoEmbed(roomInfo).build()],
      });
    } catch (error) {
      throw error;
    }
  },
};

export default command;
