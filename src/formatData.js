const fs = require('fs-extra');
const path = require('path');
const d3 = require('d3-dsv');
const states = require('./data/states.json');
const policies = require('./data/policies.json');

const SOURCE_DIR = path.join(__dirname, '/data/originals');
const AVERAGES_DIR = path.join(__dirname, '/data/averages');
const OUTPUT_DIR = path.join(__dirname, '../public/data/tax');

fs.emptyDirSync(OUTPUT_DIR);

function readDirectory(dir, callback) {
  const files = fs.readdirSync(dir);
  for (let i = 0, j = files.length; i < j; i++) {
    const year = `y${files[i].split('_')[0]}`;
    const file = d3.csvParse(
      fs.readFileSync(path.join(dir, files[i]), 'utf-8'),
    );

    file.forEach(row => {
      callback(row, year);
    });
  }
}

const outputData = {};
states.forEach(
  s => (outputData[s.id] = { id: s.id, abbr: s.abbr, name: s.name, data: {} }),
);
readDirectory(SOURCE_DIR, (row, year) => {
  const state = states.find(s => s.abbr === row.STATE).id;
  const district = `d${row.CONG_DISTRICT}`;

  if (!outputData[state].data[year]) outputData[state].data[year] = {};
  if (!outputData[state].data[year][district]) {
    outputData[state].data[year][district] = {};
  }

  outputData[state].data[year][district] = {};
  policies.forEach(policy => {
    outputData[state].data[year][district][policy.shorthand] =
      Math.round(+row[policy.id] * 100) / 100;
  });
});
readDirectory(AVERAGES_DIR, (row, year) => {
  const state = states.find(s => s.abbr === row.STATE).id;
  outputData[state].average =
    Math.round(+row['WEIGHTED_CHANGE_PER_FILER'] * 100) / 100;
});

fs.writeFileSync(
  path.join(OUTPUT_DIR, `data.json`),
  JSON.stringify(outputData),
);
