const { writeFilters } = require("./write-filters");
const { writeSummary } = require("./write-summary");
const {
  lootTiersOrder,
  sixLinkTemplate,
  uniquesTemplate,
  uniquesOverrideTemplate,
} = require("./loot-filter-templates");
const { makeUniquesFilter } = require("./uniques-filter");

const makeLootFilter = (sortedItems, minChaos = 2, extraPath = null) => {
  const { uniques } = sortedItems;

  writeSummary({ uniques });

  const baseFilter = `${sixLinkTemplate()}${uniquesOverrideTemplate()}`;
  const uniquesFilter = makeUniquesFilter(uniques);

  const filter = `${baseFilter}${uniquesFilter}`;

  writeFilters(filter, minChaos, extraPath);
};

module.exports = {
  makeLootFilter,
};
