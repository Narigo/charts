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
    const $singlesFallback0 = document.querySelectorAll(
      "#mw-content-text > div > table > tbody > tr:nth-child(2) > td > ul > li"
    );
    const $singlesFallback1 = document.querySelectorAll(
      "#mw-content-text > div > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(1) > ul > li"
    );
    const $singlesFallback2 = document.querySelectorAll(
      "#mw-content-text > div > table:nth-child(4) > tbody > tr:nth-child(2) > td > table > tbody > tr"
    );
    const $singlesFallback3 = document.querySelectorAll(
      "#mw-content-text > div > table:nth-child(5) > tbody > tr:nth-child(2) > td > table > tbody > tr"
    );
    const $singlesFallback4 = document.querySelectorAll(
      "#mw-content-text > div > table:nth-child(6) > tbody > tr:nth-child(2) > td > table > tbody > tr"
    );

    const $albumsFallback0 = document.querySelectorAll(
      "#mw-content-text > div > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(2) > ul > li"
    );
    const $albumsFallback1 = document.querySelectorAll(
      "#mw-content-text > div > table > tbody > tr:nth-child(2) > td:nth-child(2) > ul > li"
    );
    const $albumsFallback2 = document.querySelectorAll(
      "#mw-content-text > div > table:nth-child(8) > tbody > tr:nth-child(2) > td > table > tbody > tr"
    );
    const $albumsFallback3 = document.querySelectorAll(
      "#mw-content-text > div > table:nth-child(7) > tbody > tr:nth-child(2) > td > table > tbody > tr"
    );
    const $albumsFallback4 = document.querySelectorAll(
      "#mw-content-text > div > table:nth-child(6) > tbody > tr:nth-child(2) > td > table > tbody > tr"
    );

    const singleFilter = $firstElement => /^Singles/.test($firstElement.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.previousElementSibling.innerText);
    const albumFilter = $firstElement => /^Alben/.test($firstElement.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.previousElementSibling.innerText);

    const selectedSingles = [
      { list: $singlesFallback0, by: infoFromLi, extraFilter: () => true },
      { list: $singlesFallback1, by: infoFromLi, extraFilter: () => true },
      { list: $singlesFallback2, by: infoFromTable, extraFilter: singleFilter },
      { list: $singlesFallback3, by: infoFromTable, extraFilter: singleFilter },
      { list: $singlesFallback4, by: infoFromTable, extraFilter: singleFilter }
    ].find(x => x.list.length > 0 && x.extraFilter(x.list[0]));
    const selectedAlbums = [
      { list: $albumsFallback0, by: infoFromLi, extraFilter: () => true },
      { list: $albumsFallback1, by: infoFromLi, extraFilter: () => true },
      { list: $albumsFallback2, by: infoFromTable, extraFilter: albumFilter },
      { list: $albumsFallback3, by: infoFromTable, extraFilter: albumFilter },
      { list: $albumsFallback4, by: infoFromTable, extraFilter: albumFilter }
    ].find(x => x.list.length > 0 && x.extraFilter(x.list[0]));

    const singles = selectedSingles ? [].map.call(selectedSingles.list, selectedSingles.by) : [];
    const albums = selectedAlbums ? [].map.call(selectedAlbums.list, selectedAlbums.by) : [];

    return { singles, albums };

    function infoFromLi($li) {
      const interpret = selectOrNA($li, "b");
      const title = selectOrNA($li, "i");
      const duration = selectOrNA($li, "ul li");

      return { interpret, title, duration };
    }

    function infoFromTable($tr) {
      const interpret = selectOrNA($tr, "td:nth-child(3)");
      const title = selectOrNA($tr, "td:nth-child(4)");
      const duration = selectOrNA($tr, "td:nth-child(1)");

      return { interpret, title, duration };
    }

    function selectOrNA($element, selector) {
      try {
        return $element.querySelector(selector).innerText;
      } catch (e) {
        return "N/A";
      }
    }
  });

  await browser.close();

  return result;
}
