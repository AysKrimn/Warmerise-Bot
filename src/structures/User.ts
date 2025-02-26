import * as cheerio from "cheerio";
import { Cheerio } from "cheerio";
import config from "../config";
import { RankEnum, RankMedal } from "../constants";
import { AnyNode } from "domhandler";
import WeaponStats from "./Weapon";

class User {
  private div: Cheerio<AnyNode>;
  private s: string;
  private f: string;
  profileName: string;
  publicName: string;
  query: string;
  rank: RankEnum | string;
  rankHref: string | null;
  rankSym: RankMedal | null;
  kills: string;
  xp: string;
  deaths: string;
  kdr: string;
  hk: string;

  constructor(
    private $: cheerio.CheerioAPI,
    publicName: string,
    query: string
  ) {
    this.profileName = this.$("#profile_status h2").text().trim();
    this.publicName = publicName;
    this.query = query;
    this.div = this.$("#user_stats_inner_wrapper");
    this.s = `tbody[class="${query}"]`;
    this.f = "td.row-title";
    this.rank = RankEnum.notRanked;
    this.rankHref = null;
    this.rankSym = null;
    this.kills = "0";
    this.xp = "0";
    this.deaths = "0";
    this.kdr = "0";
    this.hk = "0";
  }

  getStats() {
    if (this.isBlank()) {
      return false;
    }

    const baseStats = this.div.find("table").eq(0).find(this.s).find(this.f);

    baseStats.each((_, element) => {
      const key = this.$(element).text().toLowerCase();
      const value = this.$(element)
        .next()
        .clone()
        .children()
        .remove("div")
        .end()
        .text()
        .trim();

      switch (key) {
        case "rank":
          this.rank = this.getRawRank(value, element);
          this.rankSym = this.setRankIcon();
          break;
        case "kills":
          this.kills = value;
          break;
        case "xp":
          this.xp = value;
          break;
        case "deaths":
          this.deaths = value;
          break;
        case "kdr":
          this.kdr = value;
          break;
        case "highest killstreak":
          this.hk = value;
          break;
      }
    });

    return {
      rank: this.rank,
      rankHref: this.rankHref,
      rankSym: this.rankSym,
      kills: this.kills,
      xp: this.xp,
      deaths: this.deaths,
      kdr: this.kdr,
      hk: this.hk,
    };
  }

  private setRankIcon() {
    if (this.isBanned() || this.isNotRanked()) return null;

    switch (this.rank) {
      case "1":
        this.rankSym = RankMedal.gold;
        break;
      case "2":
        this.rankSym = RankMedal.silver;
        break;
      case "3":
        this.rankSym = RankMedal.bronze;
        break;
      default:
        if (+this.rank >= 4 && +this.rank <= 100)
          this.rankSym = RankMedal.top100;
        break;
    }

    return this.rankSym;
  }

  getProfileName() {
    return this.profileName;
  }

  getWeaponStats() {
    if (isNaN(+this.rank)) return false;
    const weaponStats = new WeaponStats(this.$, this.div, this.s, this.f);
    const baseWps = weaponStats.getBaseWeaponStats();
    const paidWps = weaponStats.getPaidWeaponStats();
    const mostUsedWp = weaponStats.getMostUsedWeapon();

    return mostUsedWp;
  }

  getClans() {
    if (this.isPrivate()) return;
    const clans: { name: string; link: string }[] = [];

    this.$(".groups_profile_tab_title").each((_, element) => {
      const name = this.$(element).find("a").text().trim();
      const link = `${config.warmerise.urls.base}${this.$(element)
        .find("a")
        .attr("href")}`;

      if (name && link) {
        clans.push({ name, link });
      }
    });

    return clans.map((clan) => `[${clan.name}](${clan.link})`).join(" ");
  }

  getTotalClanCount() {
    if (this.isPrivate()) return;
    // total clans
    let totalClans = "";
    const totalGroupsElement = this.$(".tab_pulldown_contents ul li")
      .first()
      .find("span")
      .text()
      .trim();

    if (totalGroupsElement) {
      totalClans = totalGroupsElement.match(/\d+/)?.[0] || "";
    }

    return totalClans;
  }

  getBadges() {
    if (this.isPrivate()) return;
    const badges: { name: string; link: string }[] = [];

    this.$(".badges .badge-wrapper").each((_, element) => {
      const name = this.$(element).find("a").attr("title")!;
      const link = `${config.warmerise.urls.base}${this.$(element)
        .find("a")
        .attr("href")}`;

      badges.push({ name, link });
    });
    return badges.map((badge) => `[${badge.name}](${badge.link})`).join("\n");
  }

  getAvatar() {
    const imgElement = this.$("#profile_photo").find("img").attr("src");
    const profileAvatarUrl = `${config.warmerise.urls.base}/${imgElement}`;
    return profileAvatarUrl;
  }

  getCreatedAt() {
    if (this.isPrivate()) {
      return false;
    }

    const wrapper = this.$(
      "div[class='generic_layout_container layout_user_profile_info']"
    );
    const timestamp = wrapper.find("span[class='timestamp']").last().text();
    return timestamp;
  }

  getRank() {
    if (this.isBanned() || this.isNotRanked()) return this.rank;

    if (this.rankSym) {
      return `${this.rankSym} [${this.rank}](${this.rankHref})`;
    } else {
      return `[${this.rank}](${this.rankHref})`;
    }
  }
  private getRawRank(value: string, element: AnyNode) {
    if (value === RankEnum.banned) {
      return RankEnum.bannedFormatted;
    } else {
      this.rankHref = `${config.warmerise.urls.base}${this.$(element)
        .next()
        .find("a")
        .attr("href")!}`;

      return value as RankEnum;
    }
  }

  isBlank() {
    const content = this.$("#content #message").text().trim();
    const isSorry = content.startsWith("We're sorry!");
    return isSorry;
  }

  isPrivate() {
    return (
      this.$("div[class='tip']").find("span").text().trim() ===
      "This profile is private."
    );
  }

  isBanned() {
    return this.rank === RankEnum.bannedFormatted;
  }

  isNotRanked() {
    return this.rank === RankEnum.notRanked;
  }
}

export default User;
