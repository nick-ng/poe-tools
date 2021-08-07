const { chunk } = require("lodash");
const { lootTiersOrder, uniquesTemplate } = require("./loot-filter-templates");

const makeUniquesFilter = (uniques) => {
  const handledUniqueBaseTypes = [];
  const uniquesFilter = `${lootTiersOrder.reduce((prev, tier) => {
    const value = uniques[tier];

    const filteredValue = value.filter(
      (item) => !handledUniqueBaseTypes.includes(item.baseType)
    );

    let filterPart = "";

    for (const filterChunk of chunk(filteredValue, 10)) {
      const baseTypes = filterChunk.map((item) => item.baseType);
      handledUniqueBaseTypes.push(...baseTypes);
      filterPart = `${filterPart}${uniquesTemplate(baseTypes, tier)}`;
    }

    return `${prev}${filterPart}`;
  }, "")}
Hide
    Rarity Unique
    SetBackgroundColor 175 96 37
    SetTextColor 255 255 255
    SetBorderColor 0 0 0
    SetFontSize 20
`;

  return uniquesFilter;
};

module.exports = {
  makeUniquesFilter,
};
