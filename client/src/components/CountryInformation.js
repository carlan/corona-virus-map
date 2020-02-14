import React from 'react';

import { Popup } from 'react-map-gl';

const CountryInformation = ({country, onClick}) => {

  return (

    country ? (
      <Popup
        latitude={country.latlng[0]}
        longitude={country.latlng[1]}
        onClose={onClick}
        anchor="bottom"
        offsetLeft={8}
        offsetTop={-8}>
        <div>
          <h2>
            {country.countryTerritoryArea}
          </h2>
          <table className="country-region-statistics">
            <tbody>
              <tr>
                <th>Confirmed cases:</th>
                <td>{country.confirmedCases}</td>
              </tr>
              <tr>
                <th>Deaths:</th>
                <td>{country.deaths}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Popup>
    ) : null
    
  );
};

export default CountryInformation;
