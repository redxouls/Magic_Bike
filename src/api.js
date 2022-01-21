import axios from "axios";

const errorHandling = (error) => {
  // if (error.response.status === 403) window.location.replace("/");
  console.log(error);
};

export const PositionAPI = {
  getCurrentPosition: () =>
    axios.get(`/api/current/location`).catch((error) => errorHandling(error)),
  getCurrentBearing: () =>
    axios.get(`/api/current/bearing`).catch((error) => errorHandling(error)),
  postNavigation: (data) =>
    axios
      .post(`/api/navigate`, JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .catch((error) => errorHandling(error)),
  startNavigation: () =>
    axios.get(`/api/navigate/start`).catch((error) => errorHandling(error)),
  stopNavigation: () =>
    axios.get(`/api/navigate/stop`).catch((error) => errorHandling(error)),
  startRecording: () =>
    axios.get(`/api/records/start`).catch((error) => errorHandling(error)),
  stopRecording: () =>
    axios.get(`/api/records/stop`).catch((error) => errorHandling(error)),
};
