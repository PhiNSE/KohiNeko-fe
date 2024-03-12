import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { useMap } from "react-leaflet";
import { useEffect, useState } from "react";

function SearchMap({ setCoordinates, setAddress, coordinates }) {
  const map = useMap();
  //   const [coordinates, setCoordinates] = useState({ lat: 51.505, lng: -0.09 });
  //   const [address, setAddress] = useState("");

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider: provider,
      showMarker: true,
      popupMarker: false,
      autoClose: true,
      animateZoom: true,
      keepResult: true,
    });

    map.addControl(searchControl);

    map.on("geosearch/showlocation", function (result) {
      setCoordinates({ lat: result.location.y, lng: result.location.x });
      console.log(result.location);
      setAddress(result.location.label);
    });

    function getAddressFromCoordinates(lat, lng) {
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      )
        .then((response) => response.json())
        .then((data) => {
          var inputElement = document.querySelector(".glass");
          if (inputElement) {
            if (data.display_name) {
              console.log(data.display_name);
              inputElement.value = data.display_name;
            }
          }
        })
        .catch((error) => console.error(error));
    }
    getAddressFromCoordinates(coordinates?.lat, coordinates?.lng);
    return () => {
      map.removeControl(searchControl);
    };
  }, [map]);

  return (
    <div style={{ width: "100%", height: "400px" }}>
      {/* Your map component goes here */}
    </div>
  );
}
export default SearchMap;
