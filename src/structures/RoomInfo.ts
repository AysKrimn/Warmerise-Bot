import MatchMaking, {
  IRoomInfo,
  NukeModeEnum,
  CommonModeEnum,
} from "./MatchMaking";

class RoomInfo extends MatchMaking {
  roomDetail: IRoomInfo | null;
  constructor() {
    super();
    this.roomDetail = null;
  }

  getRoom(roomName: string) {
    const data = this.activeServers;
    const room = data.find(
      (room) => room.roomName.toLowerCase() === roomName.toLowerCase()
    );
    this.roomDetail = room || null;
    return room;
  }

  isNukeMode() {
    return this.roomDetail?.nukeMode === NukeModeEnum.enabled;
  }

  isKnifeMode() {
    return this.roomDetail?.knifeMode === true;
  }

  isCustomMap() {
    return this.roomDetail?.isCustomMap === CommonModeEnum.enabled;
  }
}

export default RoomInfo;
