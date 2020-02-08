import React, { useState, useEffect } from 'react';

import ReactMapGL, {
  Popup, Marker, GeolocateControl, NavigationControl, FullscreenControl, ScaleControl,
} from 'react-map-gl';

import './App.css';

const App = () => {
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

  const listMapData = async () => {
    const response = await fetch('http://localhost:4000/map-data');

    if (response.status >= 200 && response.status < 300) {
      return response.json();
    }

    throw new Error(response.statusText);
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
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
    >

      <div style={{
        position: 'absolute', top: 0, left: 0, margin: 10,
      }}
      >
        <GeolocateControl
          positionOptions={{ enableHighAccuracy: true, timeout: 30000 }}
          trackUserLocation
          fitBoundsOptions={{ maxZoom: 10 }}
        />
      </div>

      <div style={{
        position: 'absolute', top: 36, left: 0, padding: '10px',
      }}
      >
        <FullscreenControl />
      </div>

      <div style={{
        position: 'absolute', top: 72, left: 0, padding: '10px',
      }}
      >
        <NavigationControl />
      </div>

      <div style={{
        position: 'absolute', bottom: 72, left: 0, padding: '10px',
      }}
      >
        <ScaleControl />
      </div>

      {
          mapData.map((country, idx) => (
            <Marker key={idx} latitude={country.latlng[0]} longitude={country.latlng[1]} offsetTop={-20} offsetLeft={-10}>
              <img
                src="pin.png"
                height="20"
                width="14"
                alt={country.countryTerritoryArea}
                style={{ cursor: 'pointer' }}
                onClick={() => { openPopup(country); }}
              />
            </Marker>
          ))
        }

      {
        selectedCountryRegion
          ? (
            <Popup
              latitude={selectedCountryRegion.latlng[0]}
              longitude={selectedCountryRegion.latlng[1]}
              onClose={closePopup}
              anchor="bottom"
              offsetLeft={8}
              offsetTop={-8}
            >
              <div>
                <h2>
                  {selectedCountryRegion.countryTerritoryArea}
                </h2>
                <table className="country-region-statistics">
                  <tbody>
                    <tr>
                      <th>Confirmed cases:</th>
                      <td>{selectedCountryRegion.confirmedCases}</td>
                    </tr>
                    <tr>
                      <th>Deaths:</th>
                      <td>{selectedCountryRegion.deaths}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Popup>
          ) : null
}

    </ReactMapGL>
  );
};

export default App;
