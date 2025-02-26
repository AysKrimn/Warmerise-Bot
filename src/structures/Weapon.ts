import cheerio, { Cheerio, CheerioAPI, SelectorType } from "cheerio";
import { AnyNode } from "domhandler";

interface IWeaponStats {
  name: string;
  kills: number;
}

class WeaponStats {
  private div: Cheerio<AnyNode>;
  private s: string;
  private f: string;
  private order: number;
  stats: IWeaponStats[];
  minKills: number;

  constructor(
    private $: cheerio.CheerioAPI,
    div: Cheerio<AnyNode>,
    s: string,
    f: string
  ) {
    this.stats = [];
    this.div = div;
    this.order = this.div.find("table").length === 4 ? 2 : 1;
    this.s = s;
    this.f = f;
    this.minKills = 500;
  }

  getBaseWeaponStats() {
    const baseWeaponStats = this.div
      .find("table")
      .eq(this.order)
      .find(this.s)
      .find(this.f);

    baseWeaponStats.each((_, element) => {
      const name = this.$(element).text().trim();
      const kills = +this.$(element)
        .next()
        .next()
        .clone()
        .children()
        .remove("div")
        .end()
        .text()
        .trim();

      this.stats.push({ name, kills });
    });

    return this.stats;
  }

  getPaidWeaponStats() {
    const paidWeaponStats = this.div
      .find("table")
      .eq(this.order + 1)
      .find(this.s)
      .find(this.f);

    paidWeaponStats.each((_, element) => {
      const name = this.$(element).text().trim();
      const kills = +this.$(element)
        .next()
        .next()
        .clone()
        .children()
        .remove("div")
        .end()
        .text()
        .trim();

      this.stats.push({ name, kills });
    });

    return this.stats;
  }

  getMostUsedWeapon() {
    const availableWeapons = this.stats.filter(
      (weapon) => weapon.kills >= this.minKills
    );
    if (availableWeapons.length === 0) return false;
    return availableWeapons.sort((a, b) => b.kills - a.kills)[0];
  }
}

export default WeaponStats;
