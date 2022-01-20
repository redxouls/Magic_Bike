import Player from "./flvPlayer";
import React from "react";
export default class CameraControl {
    constructor(options) {
      this._options = Object.assign({}, this._options, options);
      console.log("setOriginToggle");
      this.showVideo = false;
    }
  
    onAdd(map) {
      this._map = map;
  
      this._btn = document.createElement("button");
      this._btn.className = "mapboxgl-ctrl-icon mapboxgl-ctrl-compass-toggle";
      this._btn.type = "button";
      this._btn["aria-label"] = "Toggle To Update Map Bearing";
      this._video = document.getElementById("streaming");
  
      this._btn.onclick = () => {
        this.showVideo = !this.showVideo;
        if (this.showVideo) {
          // this._options.startCallback();
          this._btn.style.backgroundColor = "darksalmon";
          this._image = document.createElement("img");
          this._image.src = "https://upload.wikimedia.org/wikipedia/commons/b/b6/%E8%8D%89%E5%B1%AF%E5%8C%97%E6%8A%95%E6%9C%9D%E9%99%BD%E5%AE%AE.jpg"
          this._image.className = "mapboxgl-ctrl-streaming"
          this._video.hidden = true;
          // this._container.parentNode.parentNode.parentNode.parentNode.appendChild(this._video);
          this._container.parentNode.parentNode.parentNode.parentNode.appendChild(this._image);
          // this.follow();
        } else {
          // this._options.stopCallback();
          // clearInterval(this.intervalID);
          this._btn.style.backgroundColor = "";
          this._video.hidden = false;
          this._container.parentNode.parentNode.parentNode.parentNode.removeChild(this._image);
        }
      };
  
      this._container = document.createElement("div");
      this._buttonContainer = document.createElement("div");
      this._buttonContainer.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
      this._buttonContainer.appendChild(this._btn);
      this._container.appendChild(this._buttonContainer);
  
      return this._container;
    }
  
    follow() {
      this.intervalID = setInterval(() => {
        this._options.updateVideo();
      }, 100);
    }
  
    onRemove() {
      this._container.parentNode.removeChild(this._container);
      this._map = undefined;
    }
  }
  