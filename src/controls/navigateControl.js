export default class NavigateControl {
  constructor(options) {
    this._options = Object.assign({}, this._options, options);
    console.log("setOriginToggle");
    this.navigating = false;
  }

  onAdd(map) {
    this._map = map;

    this._btn = document.createElement("button");
    this._btn.className = "mapboxgl-ctrl-icon mapboxgl-ctrl-not-navigating";
    this._btn.type = "button";
    this._btn["aria-label"] = "Toggle To Update Map Bearing";

    this._btn.onclick = () => {
      this.navigating = !this.navigating;
      if (this.navigating) {
        this._options.startCallback();
        this._btn.className = "mapboxgl-ctrl-icon mapboxgl-ctrl-navigating";
        this._btn.style.backgroundColor = "#879af9";
        this.follow();
      } else {
        this._options.stopCallback();
        this._btn.className = "mapboxgl-ctrl-icon mapboxgl-ctrl-not-navigating";
        this._btn.style.backgroundColor = "";
        clearInterval(this.intervalID);
      }
    };

    this._container = document.createElement("div");
    this._container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
    this._container.appendChild(this._btn);

    return this._container;
  }

  follow() {
    this.intervalID = setInterval(() => {
      this._options.updateMapBearing();
    }, 100);
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}
