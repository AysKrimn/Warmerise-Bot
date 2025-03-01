import { EmbedBuilder } from "discord.js";
import MatchMaking from "../structures/MatchMaking";
import { GREEN, ORANGE, TIPICON } from "../constants";

export class MatchmakingEmbed {
  private embed: EmbedBuilder;

  constructor(private matchMaking: MatchMaking) {
    this.embed = new EmbedBuilder();
  }

  build() {
    this.setDescription();
    this.setColor();
    return this.embed;
  }

  private setDescription() {
    const data = this.matchMaking.formatData();
    if (!data) {
      this.embed.setDescription(`${TIPICON} No active servers found`);
      this.embed.setColor(ORANGE);
    } else {
      this.embed.setDescription(data);
    }
  }

  private setColor() {
    this.embed.setColor(GREEN);
  }
}
