import { Events, Interaction, MessageFlags } from "discord.js";

const displayError = "There was an error while executing this command.";
export default {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    if (!interaction.isCommand()) return;

    const command = (interaction.client as any).commands?.get(
      interaction.commandName
    );

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: displayError,
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: displayError,
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  },
};
