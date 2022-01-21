import React, { Component } from 'react';
import {ReactFlvPlayer} from 'react-flv-player'

class Player extends Component {

  render() {
    return (
      <div className="mapboxgl-ctrl-streaming" id="streaming">
        <ReactFlvPlayer
          url = "/test.flv"
          heigh = "800px"
          width = "800px"
          isMuted={true}
        />
      </div>
    );
  }
}
export default Player;