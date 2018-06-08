const fs = require("fs");
const { promisify } = require("util");

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
    const matches = /\((\d+)\. ([a-zä]+) (?:(\d+) )?[–-] (\d+)\. ([a-zä]+)(?: (\d+))?/i.exec(duration);
    if (matches) {
      return "unfixed:" + duration;
    } else {
      console.log("duration wrong??", duration, year);
      return duration;
    }
  }
}
