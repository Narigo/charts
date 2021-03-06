const fs = require("fs");
const { promisify } = require("util");

const DURATION_MATCHER = /\(?(?<dayFrom>\d+)\.?\s(?<monthFrom>[a-zä]+)(?:\s(?<yearFrom>\d+))?(?:\s[–-]\s|\sund\s|:\s)(?<dayTo>\d+)\.\s(?<monthTo>[a-zä]+)(?:\s(?<yearTo>\d+))?/i;

run().catch(e => console.error("Error!", e));

async function run() {
  const readdir = promisify(fs.readdir);
  const readFile = promisify(fs.readFile);
  const writeFile = promisify(fs.writeFile);
  const resultsDir = `${__dirname}/../results`;
  const chartsFile = `${__dirname}/../docs/charts.js`;
  const chartsFilePerYear = year => `${__dirname}/../docs/charts/${year}.js`;

  const files = await readdir(resultsDir);
  const result = await files
    .filter(name => /result-\d+-\d+\.json$/.test(name))
    .reduce(async (acc, jsonFile) => {
      const resultJson = await acc;
      const json = await readFile(`${resultsDir}/${jsonFile}`);
      const fixedJson = fixDurations(JSON.parse(json));
      return {
        ...resultJson,
        ...fixedJson
      };
    }, Promise.resolve({}));

  const resultJson = JSON.stringify(result);
  await writeFile(`${resultsDir}/result.json`, resultJson);
  await writeFile(`${chartsFile}`, `export default ${resultJson};`);

  Object.keys(result).forEach(async year => {
    const resultJson = JSON.stringify(result[year]);
    await writeFile(`${chartsFilePerYear(year)}`, `export default ${resultJson};`);
  });
}

function fixDurations(json) {
  return Object.entries(json).reduce((acc, [year, { singles, albums }]) => {
    return {
      ...acc,
      [year]: {
        singles: [...singles.map(single => ({ ...single, duration: fixDuration(single.duration, year) }))],
        albums: [...albums.map(album => ({ ...album, duration: fixDuration(album.duration, year) }))]
      }
    };
  }, {});

  function fixDuration(duration, year) {
    const matches = DURATION_MATCHER.exec(duration);
    if (matches) {
      const { dayFrom, monthFrom, yearFrom, dayTo, monthTo, yearTo } = matches.groups;
      const monthF = monthInNumber(monthFrom);
      const monthT = monthInNumber(monthTo);
      return {
        from: `${yearFrom || year}-${nf(monthF)}-${nf(dayFrom)}`,
        to: `${yearTo || year}-${nf(monthT)}-${nf(dayTo)}`
      };
    } else {
      console.error("Wrong duration:", duration, year);
      throw new Error("Should be able to catch all durations.");
    }
  }

  function nf(num) {
    return `${num < 10 ? "0" : ""}${num}`;
  }

  function monthInNumber(month) {
    const months = [
      "Januar",
      "Februar",
      "März",
      "April",
      "Mai",
      "Juni",
      "Juli",
      "August",
      "September",
      "Oktober",
      "November",
      "Dezember"
    ];
    const monthIndex = months.findIndex(m => month === m);

    if (monthIndex < 0) {
      throw new Error(`Could not find month: ${month}`);
    }

    return monthIndex + 1;
  }
}
