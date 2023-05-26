const getUserData = {
  coords: [],
  map: {},
  mark: {},
  marker:{},
  getPosition: async function () {
    let userPos = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    return [userPos.coords.latitude, userPos.coords.longitude];
  },
  getCoords: function () {
    window.onload = async () => {
      const coords = await this.getPosition();
      this.coords = coords;
      this.buildMap();
      console.log(this.coords);
    };
  },
  buildMap() {
    this.map = L.map("map", {
      center: this.coords,
      zoom: 15,
    });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);

    this.mark = new L.Marker(this.coords);
    this.mark.addTo(this.map).bindPopup("This is your loction").openPopup();
  },
};

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: "fsq3sV42CY05uXh5jSmOVtkzgWkVEdvl9HcPQ3keld6+HjY=",
  },
};
getUserData.getCoords();
const getUserselected = {
  submit: document.querySelector("button"),
  selectUserData: function () {
    let data = document.getElementById("business").value;
    return data;
  },
};
getUserselected.submit.addEventListener("click", function () {
  let e = getUserselected.selectUserData();
  let selsect = 19014;
  if (e === "hotel") {
    selsect = 19014;
  } else if (e === "restaurant") {
    selsect = 13065;
  } else if (e === "coffee") {
    selsect = 13032;
  } else if (e === "marketplace") {
    selsect = 14009;
  }
  fetch(
    `https://api.foursquare.com/v3/places/search?radius=5000&categories=${selsect}`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      removeMarker()
      console.log(response)
      addMarker(response.results);
    })
    .catch((err) => console.error(err));
});

function addMarker(options) {
  let lat;
  let long;
  for(i = 0;i < options.length && i < 4;i++) {
    lat = options[i].geocodes.main.latitude
    long = options[i].geocodes.main.longitude
    getUserData.marker = new L.Marker([lat, long])
    getUserData.marker.addTo(getUserData.map).bindPopup(options[i].name);
    console.log(getUserData.map, "get")
  }
}

function removeMarker() {
  getUserData.marker.removeLayer(getUserData.map);
}