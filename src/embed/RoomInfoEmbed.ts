import { EmbedBuilder } from "discord.js";
import { IRoomInfo } from "../structures/MatchMaking";
import { GREEN } from "../constants";
import RoomInfo from "../structures/RoomInfo";
export class RoomInfoEmbed {
  private embed: EmbedBuilder;

  constructor(private room: RoomInfo) {
    this.embed = new EmbedBuilder();
  }

  build() {
    this.setDescription();
    this.setImage();
    this.setColor();
    this.setField();
    return this.embed;
  }

  setDescription() {
    this.embed.setDescription(`
        **Room Name:** ${this.room.roomDetail?.roomName}
        **Room Creator:** ${this.room.roomDetail?.createdBy}
        **Map Name:** ${this.room.roomDetail?.mapName}
        **Region:** ${this.room.roomDetail?.region}
        **Game Mode:** ${this.room.roomDetail?.gameMode}
        **Players:** ${this.room.roomDetail?.playerCount}/${
      this.room.roomDetail?.maxPlayers
    }
        **Match Duration:** ${this.room.roomDetail?.matchDuration}
        **Has Password:** ${this.room.roomDetail?.passwordMD5 ? "Yes" : "No"}
    `);
  }

  setField() {
    this.embed.addFields(
      {
        name: "Nuke Mode",
        value: `${this.room.isNukeMode() ? "Yes" : "No"}`,
        inline: true,
      },
      {
        name: "Knife Mode",
        value: `${this.room.isKnifeMode() ? "Yes" : "No"}`,
        inline: true,
      },
      {
        name: "Disable TPS",
        value: `${this.room.roomDetail?.disableTPS ? "Yes" : "No"}`,
        inline: true,
      },
      {
        name: "Disable Weapons",
        value: `${
          this.room.roomDetail?.disabledWeapons
            ? this.room.roomDetail?.disabledWeapons
            : "All allowed"
        }`,
        inline: true,
      },
      {
        name: "Custom Map",
        value: `${this.room.isCustomMap() ? "Yes" : "No"}`,
        inline: true,
      },
      {
        name: "Registered Only",
        value: `${this.room.roomDetail?.registeredOnly ? "Yes" : "No"}`,
        inline: true,
      }
    );
  }

  setImage() {
    this.embed.setImage(this.room.roomDetail?.mapPreview || "");
  }

  setColor() {
    this.embed.setColor(GREEN);
  }
}
