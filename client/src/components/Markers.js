import React from 'react';

import { Marker } from 'react-map-gl';

const Markers = ({data, onClick}) => {

  return (

    data.map((country, idx) => (
      <Marker key={idx} latitude={country.latlng[0]} longitude={country.latlng[1]} offsetTop={-20} offsetLeft={-10}>
        <img
          src="pin.png"
          height="20"
          width="14"
          alt={country.countryTerritoryArea}
          style={{ cursor: 'pointer' }}
          onClick={() => { onClick(country); }}
        />
      </Marker>
    ))

  );
};

export default Markers;
