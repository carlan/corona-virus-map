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
  origin: process.env.CORS_ORIGIN
}));
app.use(rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10
}))

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
        if (!$(element).find('td:nth-child(1)').text().startsWith('Total')) {
          const continent = $(element).find('td:nth-child(1)').text();
          const countryTerritoryArea = $(element).find('td:nth-child(2)').text();
          const confirmedCases = $(element).find('td:nth-child(3)').text();
          const deaths = $(element).find('td:nth-child(4)').text();

          // latitude and logitude
          // search for same name
          let found = COUNTRIES.find((c) => c.name.toLowerCase() === countryTerritoryArea.toLowerCase());
          if (!found) {
            // search for portion of same name
            found = COUNTRIES.find((c) => c.name.toLowerCase().includes(countryTerritoryArea.toLowerCase()));
          }
          if (!found) {
            // search for same alternative name
            found = COUNTRIES.find((c1) => c1.altSpellings.some((c2) => c2.toLowerCase() === countryTerritoryArea.toLowerCase()));
          }
          if (!found) {
            // search for portion of alternative name
            found = COUNTRIES.find((c1) => c1.altSpellings.some((c2) => c2.toLowerCase().includes(countryTerritoryArea.toLowerCase())));
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
