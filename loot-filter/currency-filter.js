const { chunk, uniq } = require("lodash");
const { lootTiersOrder, uniquesTemplate } = require("./loot-filter-templates");

const makeCurrencyFilter = (uniques) => {
  const handledUniqueBaseTypes = [];
  const uniquesFilter = `${lootTiersOrder.reduce((prev, tier) => {
    const value = uniques[tier];

    const filteredValue = value.filter(
      (item) => !handledUniqueBaseTypes.includes(item.baseType)
    );

    let filterPart = "";

    const baseTypes = uniq(filteredValue.map((item) => item.baseType));
    for (const baseTypesChunk of chunk(baseTypes, 10)) {
      handledUniqueBaseTypes.push(...baseTypesChunk);
      filterPart = `${filterPart}${uniquesTemplate(baseTypesChunk, tier)}`;
    }

    return `${prev}${filterPart}`;
  }, "")}
Hide
    Rarity Unique
    Sockets < 6
    SetBackgroundColor 175 96 37
    SetTextColor 255 255 255
    SetBorderColor 0 0 0
    SetFontSize 25
`;

  return uniquesFilter;
};

module.exports = {
  makeCurrencyFilter,
};
