require("dotenv").config();
const { fetchPoeNinja } = require("./utils/poe-ninja");

const run = async () => {
  const minChaos =
    parseInt(process.argv[2], 10) ||
    parseInt(process.env.DEFAULT_FILTER_CHAOS, 10);

  const results = await fetchPoeNinja(minChaos);
  console.log("results", Object.keys(results));
};

run();
