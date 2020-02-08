const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const request = require('request');
const cheerio = require('cheerio');
const useragents = require('user-agents');

require('dotenv').config();

const COUNTRIES = require('./data/countries.json');

const app = express();

app.use(compression());
app.use(morgan('common'));
app.use(helmet());
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
}));
app.use(rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
}));

const CONTINENTS = ['africa', 'antarctica', 'asia', 'australia', 'europe', 'north america', 'south america', 'america', 'oceania'];

const checkOnExactName = (arr, t, idx) => arr[idx].name.toLowerCase() === t.toLowerCase();
const checkNameIncludes = (arr, t, idx) => arr[idx].name.toLowerCase().includes(t.toLowerCase());
const checkOnExactAlternativeName = (arr, t, idx) => arr[idx].altSpellings.some((altName) => altName.toLowerCase() === t.toLowerCase());
const checkAlternativeNameIncludes = (arr, t, idx) => arr[idx].altSpellings.some((altName) => altName.toLowerCase().includes(t.toLowerCase()));

const binarySearch = (fn, array, term) => {
  let start = 0;
  let end = array.length - 1;
  let middle = Math.floor((end + start) / 2);

  while (!fn(array, term, middle) && start <= end) {
    if (term.toLowerCase() < array[middle].name.toLowerCase()) {
      end = middle - 1;
    } else if (term.toLowerCase() > array[middle].name.toLowerCase()) {
      start = middle + 1;
    }
    middle = Math.floor((end + start) / 2);
  }
  return !fn(array, term, middle) ? null : array[middle];
};

app.get('/', (req, res) => {
  res.send('👍');
});

app.get('/map-data', (req, res) => {
  const requestOptions = {
    headers: {
      'User-Agent': useragents.random().toString(),
    },
  };

  request.get(process.env.ENDPOINT_URL, requestOptions, (error, response, body) => {
    if (response && response.statusCode === 200) {
      const mapData = [];

      const $ = cheerio.load(body);

      $('div.field--item > div > table.table.table-bordered.table-condensed.table-striped > tbody > tr').each((idx, element) => {
        const continent = $(element).find('td:nth-child(1)').text();
        const countryTerritoryArea = $(element).find('td:nth-child(2)').text();
        const confirmedCases = $(element).find('td:nth-child(3)').text();
        const deaths = $(element).find('td:nth-child(4)').text();

        if (CONTINENTS.includes(continent.toLowerCase())) {
          // getting latitude and logitude from json file
          // search for same name
          let found = binarySearch(checkOnExactName, COUNTRIES, countryTerritoryArea);
          if (!found) {
            // search for portion of same name
            found = binarySearch(checkNameIncludes, COUNTRIES, countryTerritoryArea);
          }
          if (!found) {
            // search for portion of alternative name
            found = binarySearch(checkAlternativeNameIncludes, COUNTRIES, countryTerritoryArea);
          }

          mapData.push({
            continent,
            countryTerritoryArea,
            confirmedCases,
            deaths,
            latlng: found.latlng,
          });
        }
      });

      res.json(mapData);
    } else {
      res.status(500);
    }
  });
});

app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? '💩' : error.stack,
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
