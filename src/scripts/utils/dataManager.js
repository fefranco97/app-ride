const millisecondsInAMinute = 60000
const kilometersPerHour = 3.6
const earthRadiusInKilometers = 6371

async function fetchLocationData(latitude, longitude) {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&=longitude=${longitude}localityLanguage=en`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching location data:', error)
    return { city: 'Location Fetch Error', countryCode: '' }
  }
}

function getMaxSpeed(positions) {
  let maxSpeed = 0

  positions.forEach((position) => {
    if (position.speed > maxSpeed && position.speed !== null) {
      maxSpeed = position.speed
    }
  })

  return (maxSpeed * kilometersPerHour).toFixed(1)
}

function getRideDurationInMinutes(startTime, stopTime) {
  const interval = (stopTime - startTime) / 1000

  const seconds = Math.trunc(interval % 60)
  const minutes = Math.trunc(interval / 60)
  const hour = Math.trunc(minutes / 60)

  return `${formatDuration(hour, 2)}:${formatDuration(minutes, 2)}:${formatDuration(seconds, 2)}`
}

function formatDuration(number, digits) {
  return String(number.toFixed(0)).padStart(digits, '0')
}

function getStartDate(startTime) {
  const date = new Date(startTime)

  const day = date.toLocaleString('en-US', { day: 'numeric' })
  const month = date.toLocaleString('en-US', { month: 'long' })
  const year = date.toLocaleString('en-US', { year: 'numeric' })

  const hour = date.toLocaleString('en-US', { hour: '2-digit', hour12: false })
  let minute = date.toLocaleString('en-US', { minute: '2-digit' })

  if (minute.length === 1) {
    minute = '0' + minute
  }

  return `${hour}:${minute} - ${month} ${day}, ${year}`
}

function getDistanceInKilometers(positions) {
  let totalDistance = 0

  for (let i = 1; i < positions.length; i++) {
    const previousPosition = positions[i - 1]
    const currentPosition = positions[i]
    totalDistance += calculateDistance(previousPosition, currentPosition)
  }

  return totalDistance.toFixed(2)
}

function calculateDistance(prevPosition, currentPosition) {
  const prevLatitude = radians(prevPosition.latitude)
  const prevLongitude = radians(prevPosition.longitude)

  const currentLatitude = radians(currentPosition.latitude)
  const currentLongitude = radians(currentPosition.longitude)

  const distanceLatitudes = currentLatitude - prevLatitude
  const distanceLongitudes = currentLongitude - prevLongitude

  const haversineValue =
    Math.sin(distanceLatitudes / 2) * Math.sin(distanceLatitudes / 2) +
    Math.cos(prevLatitude) *
      Math.cos(currentLatitude) *
      Math.sin(distanceLongitudes / 2) *
      Math.sin(distanceLongitudes / 2)

  const centralAngle = 2 * Math.atan2(Math.sqrt(haversineValue), Math.sqrt(1 - haversineValue))
  return earthRadiusInKilometers * centralAngle
}

function radians(degrees) {
  return (degrees * Math.PI) / 180
}

function createMapImage(ride, mapId, isControllable, enablePolyline, enableMarker) {
  const startPosition = ride.data[0]
  let options = null
  if (!isControllable) {
    options = {
      attributionControl: false,
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
    }
  }
  const map = L.map(mapId, options)

  map.setView([startPosition.latitude, startPosition.longitude], 15)

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 5,
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map)

  if (enablePolyline) {
    const positionsArray = ride.data.map((position) => {
      return [position.latitude, position.longitude]
    })

    const polyline = L.polyline(positionsArray, {
      color: '#29c5cf',
      weight: 3,
    }).addTo(map)

    map.fitBounds(polyline.getBounds())
  }

  if (enableMarker) {
    L.marker([startPosition.latitude, startPosition.longitude]).addTo(map)
  }
}
