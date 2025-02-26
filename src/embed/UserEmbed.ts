import { EmbedBuilder } from "discord.js";
import User from "../structures/User";
import { RED, GREEN, ORANGE, DOT, FIELD_TITLES } from "../constants";

export class UserEmbed {
  private embed: EmbedBuilder;

  constructor(private user: User) {
    this.embed = new EmbedBuilder();
  }

  build() {
    this.setDescription();
    this.setColor();
    this.setImage();
    this.setFooter();
    return this.embed;
  }

  private setDescription() {
    let title = FIELD_TITLES.stats;
    const displayTitle =
      this.user.query === "this_year" ? (title += " (This Year)") : title;

    const clans = this.user.getClans();
    const badges = this.user.getBadges();
    const userRank = this.user.getRank();
    const userFavoriteWeapon = this.user.getWeaponStats();

    let embedDescription = `${displayTitle}\nRank: ${userRank}\nKills: ${this.user.kills}\nDeaths: ${this.user.deaths}\nKDR: ${this.user.kdr}\nHighest Killstreak: ${this.user.hk}`;

    if (userFavoriteWeapon) {
      embedDescription += `\n${FIELD_TITLES.favoriteWeapon}: ${userFavoriteWeapon.name}`;
    }

    if (clans) {
      embedDescription += `\n${FIELD_TITLES.clans}: ${clans}`;
      const totalClanCount = this.user.getTotalClanCount();

      if (totalClanCount && +totalClanCount > 5) {
        embedDescription += ` and ${+totalClanCount - 5} more`;
      }
    }

    if (badges) {
      embedDescription += `\n${FIELD_TITLES.badges}:\n ${badges}`;
    }

    this.embed.setDescription(`>>> ${embedDescription}`);
  }

  private setColor() {
    if (this.user.isBanned()) {
      this.embed.setColor(RED);
    } else if (this.user.isNotRanked()) {
      this.embed.setColor(ORANGE);
    } else {
      this.embed.setColor(GREEN);
    }
  }

  private setImage() {
    this.embed.setThumbnail(this.user.getAvatar());
  }

  setFooter() {
    const createdAt = this.user.getCreatedAt();
    let footerText = "";
    if (createdAt) {
      footerText = `${FIELD_TITLES.joined}: ${createdAt}`;
    } else {
      footerText = FIELD_TITLES.privateProfile;
    }
    this.embed.setFooter({
      text: `${DOT} ${footerText}`,
    });
  }
}
