// Creating map object
var myMap = L.map("map", {
  center: [38.01, -96.01],
  zoom: 3
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
tileSize: 512,
maxZoom: 18,
zoomOffset: -1,
id: "mapbox.streets",
accessToken: API_KEY
}).addTo(myMap);

// Use this link to get the geojson data.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Grabbing our GeoJson data D3
d3.json(queryUrl, function(data) {
  createFeatures(data.features);
});

function createFeatures(data) {
  function styleFunc(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
// Function to determine marker colour based on manitude diverse  
  function getColor(diverse) {
    switch (true) {
      case diverse > 5:
        return "#581845";
      case diverse > 4:
        return "#FC4E2A";
      case diverse > 3:
        return "#E31A1C";
      case diverse > 2:
        return "#FD8D3C";
      case diverse > 1:
        return "#FFEDA0";
      default:
        return "#FEB24C";
    }
  }

// Function to determine marker size based on manitude diverse  
    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        else
            return magnitude * 5.5;
        }

// Creating Feature Function
    var earthquakes = L.geoJSON(data, {
      pointToLayer: function (feature, latlong) {
        return L.circleMarker(latlong);
        },
    style: styleFunc,
    onEachFeature: function(feature, layer) {
    layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location:<br>" + feature.properties.place);
  }
  }).addTo(myMap);
 
  
// Set Up Legend  
  var legend = L.control({ position: 'bottomright' });
  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
    
    grades = [0, 1, 2, 3, 4, 5];
    lables = [];
    
    div.innerHTML = "<h3>Magnitude</h3>"
  
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      
      '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
  return div;
  };

//Adds Legend to myMap
  legend.addTo(myMap);
};