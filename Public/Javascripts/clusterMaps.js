const maptilerKey = "4tpPjf8ysB0fGbkanrOy";

const map = new maplibregl.Map({
  container: "map",
  style: `https://api.maptiler.com/maps/streets/style.json?key=${maptilerKey}`,
  center: [-98.5795, 39.8283],
  zoom: 3.5,
});

map.addControl(new maplibregl.NavigationControl());

const campgrounds = JSON.parse(
  document.getElementById("campgrounds-data").textContent
);

const geojson = {
  type: "FeatureCollection",
  features: campgrounds.map((cg) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: cg.geometry.coordinates,
    },
    properties: {
      id: cg._id,
      title: cg.title,
      location: cg.location,
      description: cg.description,
    },
  })),
};

map.on("load", () => {
  map.addSource("campgrounds", {
    type: "geojson",
    data: geojson,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 60,
  });

  map.addLayer({
    id: "clusters",
    type: "circle",
    source: "campgrounds",
    filter: ["has", "point_count"],
    paint: {
      "circle-color": [
        "step",
        ["get", "point_count"],
        "#51bbd6",
        10,
        "#f1f075",
        30,
        "#f28cb1",
        50,
        "#b22222",
      ],
      "circle-radius": ["step", ["get", "point_count"], 15, 10, 20, 30, 25],
    },
  });

  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "campgrounds",
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": ["Open Sans Bold"],
      "text-size": 12,
    },
    paint: {
      "text-color": "#ffffff",
    },
  });

  map.addLayer({
    id: "unclustered-point",
    type: "circle",
    source: "campgrounds",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": "#11b4da",
      "circle-radius": 8,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#fff",
    },
  });

  map.on("click", "unclustered-point", (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const { title, location, description, id } = e.features[0].properties;

    const popupHtml = `
      <strong class="text-muted">${title}</strong><br>
      <span class="text-muted">${location}</span><br>
      <p class="text-muted">${description?.slice(0, 100)}...</p>
      <a href="/campgrounds/${id}" class="text-muted">View Campground</a>
    `;

    new maplibregl.Popup().setLngLat(coordinates).setHTML(popupHtml).addTo(map);
  });

  map.on("click", "clusters", (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ["clusters"],
    });
    const clusterId = features[0].properties.cluster_id;
    map
      .getSource("campgrounds")
      .getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom,
        });
      });
  });

  map.on("mouseenter", "clusters", () => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "clusters", () => {
    map.getCanvas().style.cursor = "";
  });
});

map.on("mouseenter", "unclustered-point", () => {
  map.getCanvas().style.cursor = "pointer";
});
map.on("mouseleave", "unclustered-point", () => {
  map.getCanvas().style.cursor = "";
});
