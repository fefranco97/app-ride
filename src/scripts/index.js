const millisecondsInAMinute = 60000
const kilometersPerHour = 3.6
const earthRadiusInKilometers = 6371

const rideListContainer = document.querySelector('#rideList')
const rideRecords = getAllRidesRecords() // Assume you have this function elsewhere

processRideRecords(rideRecords)

function processRideRecords(rideRecords) {
  rideRecords.forEach(async ([id, value]) => {
    const ride = JSON.parse(value)
    ride.id = id
    const rideElement = await createRideElement(ride)

    rideListContainer.appendChild(rideElement)
  })
}

async function createRideElement(ride) {
  const itemElement = document.createElement('li')
  itemElement.id = ride.id

  const startPosition = ride.data[0]
  const startLocationData = await fetchLocationData(startPosition.latitude, startPosition.longitude)

  const cityDiv = document.createElement('div')
  cityDiv.innerText = `${startLocationData.city || 'Unknown City'} - ${
    startLocationData.countryCode || 'Unknown Country'
  }`

  const maxSpeedDiv = document.createElement('div')
  maxSpeedDiv.innerText = getMaxSpeed(ride.data)

  const durationDiv = document.createElement('div')
  durationDiv.innerText = getRideDurationInMinutes(ride.startTime, ride.stopTime)

  const distanceDiv = document.createElement('div')
  distanceDiv.innerText = getDistanceInKilometers(ride.data)

  itemElement.appendChild(cityDiv)
  itemElement.appendChild(maxSpeedDiv)
  itemElement.appendChild(durationDiv)
  itemElement.appendChild(distanceDiv)

  return itemElement
}

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
  return ((stopTime - startTime) / millisecondsInAMinute).toFixed(2)
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
  const currentLatitude = radians(prevPosition.latitude)
  const currentLongitude = radians(prevPosition.longitude)
  const nextLatitude = radians(currentPosition.latitude)
  const nextLongitude = radians(currentPosition.longitude)

  const distanceLatitudes = nextLatitude - currentLatitude
  const distanceLongitudes = nextLongitude - currentLongitude

  const haversineValue =
    Math.sin(distanceLatitudes / 2) ** 2 +
    Math.cos(currentLatitude) * Math.cos(nextLatitude) * Math.sin(distanceLongitudes / 2) ** 2

  const centralAngle = 2 * Math.asin(Math.sqrt(haversineValue))
  return earthRadiusInKilometers * centralAngle
}

function radians(degrees) {
  return (degrees * Math.PI) / 180
}
