import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";

import { PositionAPI } from "./api.js";
import SetOriginControl from "./setOriginControl.js";

mapboxgl.accessToken =
  "pk.eyJ1IjoicmVkeG91bHMiLCJhIjoiY2t4N2R1Nm1uMHl4aTJwcXViYno1Ym9sNCJ9.fByzZrach_1gQlboB02hCg";

class Map {
  constructor(ref) {
    this.container = ref;
    this.map = new mapboxgl.Map({
      container: this.container,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [121.54373533333333, 25.0190466666666684],
      zoom: 16,
    });

    // Creates new directions control instance
    this.directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: "metric",
      profile: "mapbox/cycling",
    });

    // Integrates directions control with map
    this.map.addControl(this.directions, "top-left");

    const navigation = new mapboxgl.NavigationControl();
    this.map.addControl(navigation);

    const coordinates = [121.54373533333333, 25.0190466666666684];

    this.currentMarker = new mapboxgl.Marker()
      .setLngLat(coordinates)
      .addTo(this.map);

    const setOriginControl = new SetOriginControl({
      className: "mapboxgl-ctrl",
      locateCallback: this.updateStartPoint.bind(this),
    });
    this.map.addControl(setOriginControl, "top-right");

    this.updateCurentMarker();
  }

  updateCurentMarker() {
    console.log("update my position");
    const { currentMarker } = this;
    console.log(currentMarker);
    setInterval(
      () => {
        PositionAPI.getCurentPosition().then((response) => {
          const { coordinates } = response.data;
          currentMarker.setLngLat(coordinates);
        });
      },
      1000,
      currentMarker
    );
  }

  updateStartPoint() {
    PositionAPI.getCurentPosition().then(
      function (response) {
        const { coordinates } = response.data;
        this.directions.setOrigin(coordinates);
      }.bind(this)
    );
  }
}

export default Map;
