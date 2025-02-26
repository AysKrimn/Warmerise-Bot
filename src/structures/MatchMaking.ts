import config from "../config";
import { DOT, LOCKICON } from "../constants";
import httpRequest from "../utils/httpRequest";

export enum NukeModeEnum {
  enabled = 30,
  disabled = -1,
}

export enum CommonModeEnum {
  enabled = 1,
  disabled = 0,
}

export interface IRoomInfo {
  roomName: string;
  mapName: string;
  gameMode: string;
  nukeMode: NukeModeEnum;
  knifeMode: boolean;
  playerCount: number;
  maxPlayers: number;
  mapPath: string;
  mapPreview: string;
  matchDuration: number;
  passwordMD5: string;
  disableTPS: boolean;
  createdBy: string;
  creatorRank: number;
  hasVehicles: number;
  registeredOnly: CommonModeEnum;
  isCustomMap: CommonModeEnum;
  disabledWeapons: string;
  usesQuickJoin: number;
  region: string;
}

class MatchMaking {
  private url: string;
  activeServers: IRoomInfo[] = [];

  constructor() {
    this.url = config.warmerise.urls.matchmaking;
    this.activeServers = [];
  }

  async getMatchMakingData() {
    const formData = new FormData();
    formData.append("version", "v2.3.2_v1");
    formData.append("action", "get");

    const request = await httpRequest(this.url, true, {
      method: "POST",
      body: formData,
    });

    if (!request.status) {
      return false;
    }

    const base64Response = await request.data;
    const decodeBase64 = Buffer.from(base64Response, "base64").toString(
      "utf-8"
    );
    return this.parseData(decodeBase64);
  }

  formatData() {
    const groupedServers = this.activeServers.reduce(
      (acc: { [key: string]: IRoomInfo[] }, server) => {
        const region = server.region;
        if (!acc[region]) {
          acc[region] = [];
        }
        acc[region].push(server);
        return acc;
      },
      {}
    );

    const formattedServers = Object.entries(groupedServers)
      .map(([region, servers]) => {
        const serverList = servers
          .map((room) => {
            const link = this.getRoomConnectLink(room);
            const hasPassword = this.hasPassword(room);
            let lockIcon = "";

            if (hasPassword) {
              lockIcon = LOCKICON;
            }

            return `${DOT} **Room:** [${room.roomName}](${link}) **Map:** ${room.mapName} **Players:** ${room.playerCount}/${room.maxPlayers} ${lockIcon}`;
          })
          .join("\n");

        return `**${region}**\n${serverList}`;
      })
      .join("\n\n")
      .trim();

    return formattedServers;
  }

  private parseData(data: string) {
    if (!data) return false;
    const dataWithoutMarkers = data
      .replace("WM_ROOM_DATA_START_", "")
      .replace("_WM_ROOM_DATA_END", "");
    const roomDataSet = dataWithoutMarkers.split("@_region_separator_@");

    for (let dataSet of roomDataSet) {
      if (!dataSet.trim()) continue;

      try {
        const region = JSON.parse(dataSet);

        if (region.roomDataJsonCombined) {
          const rooms = region.roomDataJsonCombined.split("@_room_separator_@");
          const parsedRooms = rooms.map((room: any) => {
            const roomInfo = JSON.parse(room);

            roomInfo.gameMode =
              roomInfo.gameMode === 100
                ? "TDM"
                : roomInfo.gameMode === 101
                ? "Elimination"
                : "Unknown";

            roomInfo.region = region.region;
            return roomInfo;
          });

          this.activeServers.push(...parsedRooms);
        }
      } catch (error) {
        throw error;
      }
    }

    return this.activeServers;
  }

  private hasPassword(room: IRoomInfo) {
    return room.passwordMD5.length > 0;
  }

  private getRoomConnectLink(room: IRoomInfo) {
    // https://warmerise.com/join?n=Gaming+Room+2866&gm=Elimination&a=ru&m=SecretLab&p=12
    // europe a = tr east = ru usa east a = us usa west a = usw india a = in sout africa a = za south america a = sa  asia a = asia japan a = jp australia a = au
    const roomName = room.roomName.split(" ").join("+");
    const mapName = room.mapName.split(" ").join("+");
    let a = "";
    switch (room.region) {
      case "Europe":
        a = "tr";
        break;
      case "Europe East":
        a = "ru";
        break;
      case "USA East":
        a = "us";
      case "USA West":
        a = "usw";
        break;
      case "South America":
        a = "sa";
        break;
      case "Asia":
        a = "asia";
        break;
      case "Japan":
        a = "jp";
        break;
      case "Australia":
        a = "au";
        break;
      case "India":
        a = "in";
        break;
      case "South Africa":
        a = "za";
        break;
    }
    return `${config.warmerise.urls.join}n=${roomName}&gm=${room.gameMode}&a=${a}&m=${mapName}&p=${room.playerCount}`;
  }
}

export default MatchMaking;
