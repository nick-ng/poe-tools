const fs = require("fs");
const path = require("path");

const writeFileSync = (filePath, options) => {
  const dirName = path.dirname(filePath);
  fs.mkdirSync(dirName, {
    recursive: true,
  });

  return fs.writeFileSync(filePath, options);
};

const makeSection = (sectionName, data) => {
  return `
    <h3>${sectionName}</h3>
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Class</th>
                <th>Base Type</th>
                <th>Chaos</th>
                <th>ID</th>
                <th>Wiki</th>
            </tr>
        </thead>
        <tbody>
            ${Object.keys(data)
              .map((key) => {
                const tier = data[key];
                return tier
                  .map((item) => {
                    return `
                    <tr>
                        <td>${item.name}</td>
                        <td>${key}</td>
                        <td>${item.baseType}</td>
                        <td>${item.chaosValue}</td>
                        <td>${item.detailsId}</td>
                        <td><a href="${item.wiki}" target="_blank">Wiki</a></td>
                    </tr>
                    `;
                  })
                  .join("\n");
              })
              .join("\n")}
        </tbody>
    </table>
    `;
};

const ezWrite = (string, filename) => {
  writeFileSync(
    path.resolve(__dirname, "..", "output-filters", filename.toLowerCase()),
    string
  );
};

const writeSummary = ({ uniques }) => {
  const output = `<html>
  <head>
  <style type="text/css">
    td, th {
        border: 1px solid grey;
        padding: 0.5rem;
    }

    table {
        border-collapse: collapse;
    }
  </style>
  </head>
  <body>
  ${makeSection("Uniques", uniques)}
  </body>
  </html>`;

  ezWrite(output, "summary.html");
};

module.exports = {
  writeSummary,
};
