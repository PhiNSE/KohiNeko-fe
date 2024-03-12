import React from "react";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";

const Map = ({ address }) => {
  const containerStyle = {
    width: "600px",
    height: "600px",
  };
  const center = {
    lat: address.coordinates.lat,
    lng: address.coordinates.lng,
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyBV8-N1M4qG2Cxcyp5RCwZ2lf5oPsMIprc">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        options={{
          disableDefaultUI: true,
          zoomControl: false,
          draggable: false,
          scrollwheel: false,
          disableDoubleClickZoom: true,
        }}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
