const fetch = require("node-fetch");
const path = require("path");
const { getLeague } = require("./utils");
const { writeFileSync } = require("../loot-filter/write-filters");
const { poeNinjaBlackList } = require("./poe-ninja-lists");

const POE_NINJA_CURRENCY = ["Currency", "Fragment"];
const POE_NINJA_ITEM = [
  "DeliriumOrb",
  "Watchstone",
  "Oil",
  // "Incubator",
  "Scarab",
  "Fossil",
  "Resonator",
  "Essence",
  "DivinationCard",
  // "Prophecy",
  // "SkillGem",
];

// https://poe.ninja/api/data/ItemOverview?league=Expedition&type=UniqueWeapon&language=en
// https://poe.ninja/api/data/ItemOverview?league=Expedition&type=UniqueArmour&language=en
// https://poe.ninja/api/data/ItemOverview?league=Expedition&type=UniqueAccessory&language=en
// https://poe.ninja/api/data/ItemOverview?league=Expedition&type=UniqueFlask&language=en
// https://poe.ninja/api/data/ItemOverview?league=Expedition&type=UniqueJewel&language=en
const POE_NINJA_UNIQUE = [
  "UniqueWeapon",
  "UniqueArmour",
  "UniqueAccessory",
  "UniqueFlask",
  "UniqueJewel",
];

const OPTIONS = {
  method: "GET",
  mode: "cors",
};

const fetchUnique = async (type, league) => {
  const query = new URLSearchParams({
    league,
    type,
    language: "en",
  });
  const url = `https://poe.ninja/api/data/ItemOverview?${query}`;
  const res = await fetch(url, OPTIONS);

  if (res.status === 200) {
    const resJson = await res.json();

    return resJson.lines;
  }

  return [];
};

const fetchCurrency = async (league) => {
  const query = new URLSearchParams({
    league,
    type: "Currency",
    language: "en",
  });

  const url = `https://poe.ninja/api/data/CurrencyOverview?${query}`;
  const res = await fetch(url, OPTIONS);

  if (res.status === 200) {
    const resJson = await res.json();

    return resJson.lines.map((a) => ({
      // ...a,
      name: a.currencyTypeName,
      baseType: a.currencyTypeName,
      detailsId: a.detailsId,
      chaosValue: a.chaosEquivalent,
      wiki: `https://pathofexile.fandom.com/wiki/${a.currencyTypeName.replaceAll(
        " ",
        "_"
      )}`,
      source: null,
      cannotDrop: false,
    }));
  }

  return [];
};

const sortTiers = (items, minChaos) => {
  const tiers = [32, 16, 8, 4, 2, 1, 0];
  return items.reduce((prev, curr) => {
    for (const tier of tiers) {
      const tierKey = `x${tier}`;
      const threshold = minChaos * tier;
      if (curr.chaosValue >= threshold) {
        if (!prev[tierKey]) {
          prev[tierKey] = [];
        }
        prev[tierKey].push(curr);
        return prev;
      }
    }
    return prev;
  }, {});
};

const sortTiersCurrency = (items, minChaos) => {
  const tiers = [32, 16, 8, 4, 2, 1, 0];
  return items.reduce((prev, curr) => {
    for (const tier of tiers) {
      const tierKey = `x${tier}`;
      const threshold = minChaos * tier * 0.1;
      if (curr.chaosValue >= threshold) {
        if (!prev[tierKey]) {
          prev[tierKey] = [];
        }
        prev[tierKey].push(curr);
        return prev;
      }
    }
    return prev;
  }, {});
};

const fs = require("fs");

const fetchPoeNinja = async (minChaos = 2) => {
  const league = await getLeague();

  const currency = await fetchCurrency(league);
  const sortedCurrency = sortTiersCurrency(currency, minChaos);

  // fs.writeFileSync("currency.json", JSON.stringify(sortedCurrency, null, "  "));

  // return {};

  const uniques = await Promise.all(
    POE_NINJA_UNIQUE.map((type) => fetchUnique(type, league))
  );

  const flatUniques = uniques
    .reduce((prev, curr) => prev.concat(curr), [])
    .filter((item) => {
      if (item.links) {
        return false;
      }
      if (item.detailsId.startsWith("replica-")) {
        return false;
      }
      if (poeNinjaBlackList.includes(item.detailsId)) {
        return false;
      }

      return true;
    })
    .map((item) => ({
      name: item.name,
      baseType: item.baseType,
      chaosValue: item.chaosValue,
      detailsId: item.detailsId,
      wiki: `https://pathofexile.fandom.com/wiki/${item.name.replaceAll(
        " ",
        "_"
      )}`,
      source: null,
      cannotDrop: false,
    }));
  const sortedUniques = sortTiers(flatUniques, minChaos);

  writeFileSync(
    path.resolve(__dirname, "..", "notes", "uniques.json"),
    JSON.stringify(sortedUniques, null, "  ")
  );

  return { uniques: sortedUniques, currency: sortedCurrency };
};

module.exports = {
  fetchPoeNinja,
};

/**
 * {
    "id": 46138,
    "name": "Replica Duskdawn",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvV2VhcG9ucy9Ud29IYW5kV2VhcG9ucy9TdGF2ZXMvU29sYXJpc0x1bmFyaXNTdGFmZiIsInciOjIsImgiOjQsInNjYWxlIjoxfV0/e5e9df18a4/SolarisLunarisStaff.png",
    "levelRequired": 64,
    "baseType": "Maelström Staff",
    "links": 6,
    "itemClass": 3,
    "sparkline": {
      "data": [],
      "totalChange": 0
    },
    "lowConfidenceSparkline": {
      "data": [
        0,
        -25.57,
        -39.22,
        -52.92,
        -38.89,
        -56.3,
        -47.12
      ],
      "totalChange": -47.12
    },
    "implicitModifiers": [
      {
        "text": "+25% Chance to Block Attack Damage while wielding a Staff",
        "optional": false
      }
    ],
    "explicitModifiers": [
      {
        "text": "+10% Chance to Block Attack Damage while wielding a Staff",
        "optional": false
      },
      {
        "text": "(42-50)% increased Critical Strike Chance",
        "optional": false
      },
      {
        "text": "Gain (11-19)% of Elemental Damage as Extra Chaos Damage",
        "optional": false
      },
      {
        "text": "+1% to Critical Strike Multiplier per 1% Chance to Block Attack Damage",
        "optional": false
      },
      {
        "text": "+60% to Critical Strike Multiplier if you've dealt a Non-Critical Strike Recently",
        "optional": false
      },
      {
        "text": "(124-150)% increased Elemental Damage if you've dealt a Critical Strike Recently",
        "optional": false
      }
    ],
    "flavourText": "\"Lab Two suffered significant structural damage in the process of creating\nPrototype #77. It is, however, the closest we've come to perfection.\"",
    "itemType": "Staff",
    "chaosValue": 986.31,
    "exaltedValue": 9,
    "count": 3,
    "detailsId": "replica-duskdawn-maelstrom-staff-6l",
    "listingCount": 3
  },
 */
