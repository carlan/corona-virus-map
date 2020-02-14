import React, { useState, useEffect } from 'react';

import ReactMapGL from 'react-map-gl';

import MapControls from './MapControls';
import Markers from './Markers';
import CountryInformation from './CountryInformation';

import listMapData from '../services/MapService';

const Map = () => {
  const [mapData, setMapData] = useState([]);

  const [viewport, setViewport] = useState({
    zoom: 1.9,
  });

  const [selectedCountryRegion, setSelectedCountryRegion] = useState(null);

  const openPopup = (country) => {
    setSelectedCountryRegion(country);
  };

  const closePopup = () => {
    setSelectedCountryRegion(null);
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await listMapData();
        setMapData(data);
        localStorage.setItem('mapData', JSON.stringify(data));
      } catch (error) {
        setMapData(JSON.parse(localStorage.getItem('mapData')));
      }
    })();
  }, []);

  return (
    <ReactMapGL
      {...viewport}
      width="100vw"
      height="100vh"
      mapStyle="mapbox://styles/mapbox/dark-v9"
      maxZoom={10}
      onViewportChange={setViewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}>

      <MapControls />

      <Markers data={mapData} onClick={openPopup} />

      <CountryInformation country={selectedCountryRegion} onClick={closePopup}/>

    </ReactMapGL>
  );
};

export default Map;
