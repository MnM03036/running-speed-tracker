let watchId;
let positions = [];
let startTime;
let totalDistance = 0; // store total km

function startTracking() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  positions = [];
  totalDistance = 0;
  startTime = Date.now();

  watchId = navigator.geolocation.watchPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      positions.push({ latitude, longitude, time: Date.now() });

      // If we have more than 1 point, add distance
      if (positions.length > 1) {
        const last = positions[positions.length - 1];
        const prev = positions[positions.length - 2];
        const segment = haversineDistance(prev, last); // km
        totalDistance += segment;
      }

      updateStats();
    },
    (err) => {
      alert("Error: " + err.message);
    },
    { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
  );
}

function stopTracking() {
  navigator.geolocation.clearWatch(watchId);
}

function updateStats() {
  if (positions.length < 2) return;

  const last = positions[positions.length - 1];
  const prev = positions[positions.length - 2];

  const dist = haversineDistance(last, prev); // km
  const timeDiff = (last.time - prev.time) / 3600000; // hours

  const speed = dist / timeDiff; // km/h

  document.getElementById("output").innerHTML = `Current Speed: ${speed.toFixed(
    2
  )} km/h<br>
     Total Distance: ${totalDistance.toFixed(3)} km`;
}

function haversineDistance(pos1, pos2) {
  const R = 6371; // Earth radius in km
  const dLat = toRad(pos2.latitude - pos1.latitude);
  const dLon = toRad(pos2.longitude - pos1.longitude);
  const lat1 = toRad(pos1.latitude);
  const lat2 = toRad(pos2.latitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}
