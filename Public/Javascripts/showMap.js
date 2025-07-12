const maptilerKey = "4tpPjf8ysB0fGbkanrOy";

const campground = JSON.parse(
  document.getElementById("campground-data").textContent
);

const map = new maplibregl.Map({
  container: "map",
  style: `https://api.maptiler.com/maps/streets/style.json?key=${maptilerKey}`,
  center: campground.geometry.coordinates,
  zoom: 10,
});

map.addControl(new maplibregl.NavigationControl());

new maplibregl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new maplibregl.Popup().setHTML(`
      <h6 class="text-muted">${campground.title}</h6>
      <span class="text-muted">${campground.location}</span><br>
      <span class="text-muted">$${campground.price}/night</span>
    `)
  )
  .addTo(map);
