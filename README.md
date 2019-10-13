# charts

Crawling Wikipedia for german charts with puppeteer. Have a look at the [results](./results/).

## How to run

To crawl the pages:

```
node crawler <year-from> <year-to>
```

To fix the durations and put everything into a `result.json` and write it into `docs/charts.js`:

```
node into-charts
```

## Some background information

Single Charts started in the end of 1953, Album charts started in 1962.
