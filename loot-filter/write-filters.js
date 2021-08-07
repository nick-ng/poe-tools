const fs = require("fs");
const path = require("path");

const baseFiltersPath = path.resolve(__dirname, "..", "base-filters");

const writeFileSync = (filePath, options) => {
  const dirName = path.dirname(filePath);
  fs.mkdirSync(dirName, {
    recursive: true,
  });

  return fs.writeFileSync(filePath, options);
};

const writeFilters = (filter, minChaos, extraPath) => {
  const baseFilters = fs.readdirSync(baseFiltersPath);
  const date = new Date();

  baseFilters.forEach((baseFilterName) => {
    baseFilterPath = path.resolve(baseFiltersPath, baseFilterName);
    const baseFilter = fs.readFileSync(baseFilterPath);
    const filterName = path.basename(baseFilterName, ".filter");

    writeFileSync(
      path.resolve(
        __dirname,
        "..",
        "output-filters",
        `zz_${filterName}_plus_${minChaos}c_${date
          .toISOString()
          .slice(0, 13)}.filter`
      ),
      `${filter}${baseFilter}`
    );
    if (extraPath) {
      writeFileSync(
        path.resolve(
          extraPath,
          `zz_${filterName}_plus_${minChaos}c_latest.filter`
        ),
        `${filter}${baseFilter}`
      );
    }
  });
};

module.exports = {
  writeFileSync,
  writeFilters,
};
