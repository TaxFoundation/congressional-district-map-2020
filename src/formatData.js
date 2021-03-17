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
      p: Math.round(+row.PAYROLL_PER_FILER * 100) / 100,
      mr: Math.round(+row.MARGINAL_RATE_PER_FILER * 100) / 100,
      pl: Math.round(+row.PEASE_LIMIT_PER_FILER * 100) / 100,
      cg: Math.round(+row.CAPITAL_GAINS_AND_DIVIDENDS_PER_FILER * 100) / 100,
      il: Math.round(+row.ITEMIZED_LIMIT_PER_FILER * 100) / 100,
      bd: Math.round(+row.BUSINESS_DEDUCTION_PER_FILER * 100) / 100,
      ctc: Math.round(+row.CTC_PER_FILER * 100) / 100,
      cd: Math.round(+row.CDCTC_PER_FILER * 100) / 100,
      hc: Math.round(+row.HOMEBUYER_CREDIT_PER_FILER * 100) / 100,
    };
  });
}

fs.writeFileSync(
  path.join(OUTPUT_DIR, `data.json`),
  JSON.stringify(outputData),
);
