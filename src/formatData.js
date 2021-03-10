const fs = require('fs-extra');
const path = require('path');
const d3 = require('d3-dsv');
const states = require('./data/states.json');

const SOURCE_DIR = path.join(__dirname, '/data/originals');
const OUTPUT_DIR = path.join(__dirname, '../public/data/tax');

fs.emptyDirSync(OUTPUT_DIR);

const outputData = {};
states.forEach(
  s => (outputData[s.id] = { id: s.id, abbr: s.abbr, name: s.name, data: {} }),
);
const files = fs.readdirSync(SOURCE_DIR);
for (let i = 0, j = files.length; i < j; i++) {
  const year = `y${files[i].split('_')[0]}`;
  const file = d3.csvParse(
    fs.readFileSync(path.join(SOURCE_DIR, files[i]), 'utf-8'),
  );

  file.forEach(row => {
    const state = states.find(s => s.abbr === row.STATE).id;
    const district = `d${row.CONG_DISTRICT}`;

    if (!outputData[state].data[year]) outputData[state].data[year] = {};
    if (!outputData[state].data[year][district]) {
      outputData[state].data[year][district] = {};
    }

    outputData[state].data[year][district] = {
      netChange: Math.round(+row.NET_TAX_CHANGE_PER_FILER * 100) / 100,
    };
  });
}

fs.writeFileSync(
  path.join(OUTPUT_DIR, `data.json`),
  JSON.stringify(outputData),
);
