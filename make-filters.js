require("dotenv").config();
const { fetchPoeNinja } = require("./utils/poe-ninja");
const { makeLootFilter } = require("./loot-filter");

const run = async () => {
  const minChaos =
    parseInt(process.argv[2], 10) ||
    parseInt(process.env.DEFAULT_FILTER_CHAOS, 10);

  const results = await fetchPoeNinja(minChaos);
  makeLootFilter(results, minChaos, process.env.POE_SETTINGS_PATH);
  console.log("All done");
};

run();
