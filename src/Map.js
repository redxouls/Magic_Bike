import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";

import { PositionAPI } from "./api.js";

import {
  SetOriginControl,
  PitchControl,
  CompassControl,
  NavigateControl,
  CameraControl
} from "./controls";

import LocationMarker from "./markers/Location.js";

mapboxgl.accessToken =
  "pk.eyJ1IjoicmVkeG91bHMiLCJhIjoiY2t4N2R1Nm1uMHl4aTJwcXViYno1Ym9sNCJ9.fByzZrach_1gQlboB02hCg";

class Map {
  constructor(ref) {
    this.navigating = false;
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
      interactive: true,
      controls: {
        inputs: true,
        instructions: false,
        profileSwitcher: true,
      },
    });

    // Integrates directions control with map
    this.map.addControl(this.directions, "top-left");

    const navigation = new mapboxgl.NavigationControl({ showCompass: false });
    this.map.addControl(navigation);

    const coordinates = [121.54373533333333, 25.0190466666666684];

    this.currentMarker = new mapboxgl.Marker(LocationMarker())
      .setLngLat(coordinates)
      .setRotation(0)
      .addTo(this.map);

    this.map.addControl(
      new CompassControl({
        updateCurrentMarkerBearing: this.updateCurrentMarkerBearing.bind(this),
      }),
      "top-right"
    );

    this.map.addControl(
      new SetOriginControl({
        updateCallback: this.updateStartPoint.bind(this),
      }),
      "top-right"
    );

    this.map.addControl(
      new NavigateControl({
        startCallback: this.startNavigation.bind(this),
        stopCallback: this.stopNavigation.bind(this),
        updateMapBearing: this.updateMapBearing.bind(this),
      }),
      "top-right"
    );

    this.map.addControl(new PitchControl({ minpitchzoom: 17 }));

    this.directions.on("origin", (e) => {
      console.log(e.feature.geometry.coordinates);
      fetch("/api/navigate", {
        body: JSON.stringify({ start: e.feature.geometry.coordinates }), // must match 'Content-Type' header
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (myJson) {
          console.log(myJson);
        });
    });

    this.map.addControl(new CameraControl());
    

    this.directions.on("destination", (e) => {
      console.log(e.feature.geometry.coordinates);
      fetch("/api/navigate", {
        body: JSON.stringify({ end: e.feature.geometry.coordinates }), // must match 'Content-Type' header
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (myJson) {
          console.log(myJson);
        });
    });

    // this.updateCurrentMarkerPostion();
    // this.updateCurrentMarkerBearing()
    // this.updateMapBearing();

    // Add markers to the map.
  }

  updateCurrentMarkerPosition() {
    console.log("update my position");
    const { currentMarker } = this;
    setInterval(
      () => {
        PositionAPI.getCurentPosition().then((response) => {
          console.log(response);
          if (response) {
            const { coordinates } = response.data;
            currentMarker.setLngLat(coordinates);
          }
        });
      },
      1000,
      currentMarker
    );
  }

  updateCurrentMarkerBearing() {
    PositionAPI.getCurrentBearing().then((response) => {
      console.log(response);
      if (response) {
        const { bearing } = response.data;
        this.currentMarker.setRotation(bearing);
      }
    });
  }

  updateMapBearing() {
    PositionAPI.getCurrentBearing().then((response) => {
      if (response) {
        const { bearing } = response.data;
        this.map.easeTo({ pitch: 0, bearing });
      }
    });
  }

  updateStartPoint() {
    PositionAPI.getCurrentPosition().then(
      function (response) {
        if (response) {
          const { coordinates } = response.data;
          this.directions.setOrigin(coordinates);
        }
      }.bind(this)
    );
  }

  updateBearing() {
    PositionAPI.getCurrentBearing().then(
      function (response) {
        if (response) {
          const { bearing } = response.data;
          this.map.easeTo({ pitch: 0, bearing });
          console.log(bearing);
        }
      }.bind(this)
    );
  }

  startNavigation() {
    PositionAPI.startNavigation();
    PositionAPI.startRecording();
  }

  stopNavigation() {
    PositionAPI.stopNavigation();
    PositionAPI.stopRecording();
  }
}

export default Map;
