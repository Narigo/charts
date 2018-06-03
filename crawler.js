const fs = require("fs");
const { promisify } = require("util");
const puppeteer = require("puppeteer");
const yearFrom = process.argv[2];
const yearTo = process.argv[3];

const years = [];
for (let i = yearFrom; i <= yearTo; i++) {
  years.push(i);
}

return years
  .reduce(async (acc, year) => {
    const result = await acc;
    const crawled = await crawl(year);
    if (crawled.singles.length === 0) {
      console.warn("Keine Singles gefunden!", year);
    }
    if (crawled.albums.length === 0) {
      console.warn("Keine Alben gefunden!", year);
    }
    result[year] = crawled;
    return result;
  }, {})
  .then(async all => {
    promisify(fs.writeFile)(`results/result-${yearFrom}-${yearTo}.json`, JSON.stringify(all));
  });

async function crawl(year) {
  console.log("crawling year", year);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://de.wikipedia.org/wiki/Liste_der_Nummer-eins-Hits_in_Deutschland_(${year})`, {
    waitUntil: "networkidle2"
  });

  const result = await page.evaluate(() => {
    const $singles = document.querySelectorAll(
      "#mw-content-text > div > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(1) > ul > li"
    );
    const $albums = document.querySelectorAll(
      "#mw-content-text > div > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(2) > ul > li"
    );

    const $singlesFallback1 = document.querySelectorAll(
      "#mw-content-text > div > table > tbody > tr:nth-child(2) > td > ul > li"
    );
    const $albumsFallback1 = document.querySelectorAll(
      "#mw-content-text > div > table > tbody > tr:nth-child(2) > td:nth-child(2) > ul > li"
    );

    const singles = [].map.call($singles.length > 0 ? $singles : $singlesFallback1, infoFromLi);
    const albums = [].map.call($albums.length > 0 ? $albums : $albumsFallback1, infoFromLi);

    return { singles, albums };

    function infoFromLi($li) {
      const interpret = selectOrNA($li, "b");
      const title = selectOrNA($li, "i");
      const duration = selectOrNA($li, "ul li");

      return { interpret, title, duration };
    }

    function selectOrNA($li, selector) {
      try {
        return $li.querySelector(selector).innerText;
      } catch (e) {
        return "N/A";
      }
    }
  });

  await browser.close();

  return result;
}
