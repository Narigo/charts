const fs = require("fs");
const { promisify } = require("util");

const DURATION_MATCHER = /\((?<dayFrom>\d+)\.? (?<monthFrom>[a-zä]+)(?: (?<yearFrom>\d+))?(?: [–-] | und |: )(?<dayTo>\d+)\. (?<monthTo>[a-zä]+)(?: (?<yearTo>\d+))?/i;

return run().catch(e => console.error("Error!", e));

async function run() {
  const readdir = promisify(fs.readdir);
  const readFile = promisify(fs.readFile);
  const writeFile = promisify(fs.writeFile);
  const resultsDir = `${__dirname}/results`;

  const files = await readdir(resultsDir);
  const result = await files.filter(name => /result-\d+-\d+\.json$/.test(name)).reduce(async (acc, jsonFile) => {
    const resultJson = await acc;
    const json = await readFile(`${resultsDir}/${jsonFile}`);
    const fixedJson = fixDurations(JSON.parse(json));
    return {
      ...resultJson,
      ...fixedJson
    };
  }, Promise.resolve({}));

  await writeFile(`${resultsDir}/result.json`, JSON.stringify(result));
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
      return { from: `${yearFrom || year}-${monthF}-${dayFrom}`, to: `${yearTo || year}-${monthT}-${dayTo}` };
    } else {
      console.log("duration wrong??", duration, year);
      return duration;
    }
  }

  function monthInNumber(month) {
    switch (month) {
      case "Januar":
        return 1;
      case "Februar":
        return 2;
      case "März":
        return 3;
      case "April":
        return 4;
      case "Mai":
        return 5;
      case "Juni":
        return 6;
      case "Juli":
        return 7;
      case "August":
        return 8;
      case "September":
        return 9;
      case "Oktober":
        return 10;
      case "November":
        return 11;
      case "Dezember":
        return 12;
      default:
        console.log("Wrong month!", month);
        return month;
    }
  }
}
