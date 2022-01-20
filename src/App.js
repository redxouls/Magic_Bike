import { render } from "@testing-library/react";
import React, { useEffect, useRef, useState } from "react";
import Player from "./controls/flvPlayer";
import "./App.css";

import Map from "./Map.js";

const App = () => {
  const mapRef = useRef(null);
  const [mapApp, setMapApp] = useState(null);

  useEffect(() => {
    const mapApp = new Map(mapRef.current);
    setMapApp(mapApp);
  }, []);
  // const flvPlayer = () => (
  //   <div style="absolute">
      
  //   </div>
  // )
  return <div><Player /><div ref={mapRef} className="mapWrapper"></div></div>;
};

export default App;
