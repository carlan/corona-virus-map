import React from 'react';

import {GeolocateControl, NavigationControl, FullscreenControl, ScaleControl} from 'react-map-gl';

const MapControls = () => {

  const geolocateControlStyle = {
    position: 'absolute', top: 0, left: 0, margin: 10,
  };

  const fullscreenControlStyle = {
    position: 'absolute', top: 36, left: 0, padding: '10px',
  };
  
  const navicationControlStype = {
    position: 'absolute', top: 72, left: 0, padding: '10px',
  };
  
  const scaleControlStyle = {
    position: 'absolute', bottom: 72, left: 0, padding: '10px',
  };

  return (

    <>
      <div style={geolocateControlStyle}>
        <GeolocateControl
          positionOptions={{ enableHighAccuracy: true, timeout: 30000 }}
          trackUserLocation
          fitBoundsOptions={{ maxZoom: 10 }}/>
      </div>

      <div style={fullscreenControlStyle}>
        <FullscreenControl />
      </div>

      <div style={navicationControlStype}>
        <NavigationControl />
      </div>

      <div style={scaleControlStyle}>
        <ScaleControl />
      </div>
    </>

  );

};

export default MapControls;