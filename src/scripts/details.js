const rideId = new URLSearchParams(window.location.search).get('id')
const ride = getRideRecord(rideId)
const rideDetailsContainer = document.querySelector('#detailsContainer')

processRideRecord(ride)

document.querySelector('#deleteButton').addEventListener('click', () => {
  deleteRideRecord(rideId)
  window.location.href = '../../index.html'
})

async function processRideRecord(ride) {
  const rideDetailsElement = await createRideElement(ride)
  rideDetailsContainer.appendChild(rideDetailsElement)
}

async function createRideElement(ride) {
  const containerElement = document.createElement('div')
  containerElement.id = rideId
  containerElement.className = 'd-flex p-2 align-items-center justify-content-between gap-3'

  const dataElement = document.createElement('div')
  dataElement.className = 'd-flex flex-column flex-fill'

  const startPosition = ride.data[0]
  const startLocationData = await fetchLocationData(startPosition.latitude, startPosition.longitude)

  const cityDiv = document.createElement('div')
  cityDiv.innerText = `${startLocationData.city || 'Unknown City'} - ${
    startLocationData.countryCode || 'Unknown Country'
  }`
  cityDiv.className = 'text-primary mb-2'

  const maxSpeedDiv = document.createElement('div')
  maxSpeedDiv.innerText = `Max Speed: ${getMaxSpeed(ride.data)} km/h`
  maxSpeedDiv.className = 'h5'

  const durationDiv = document.createElement('div')
  durationDiv.innerText = `Total duration: ${getRideDurationInMinutes(
    ride.startTime,
    ride.stopTime
  )}`

  const distanceDiv = document.createElement('div')
  distanceDiv.innerText = `Total distance: ${getDistanceInKilometers(ride.data)} km`

  const startDateDiv = document.createElement('div')
  startDateDiv.innerText = getStartDate(ride.startTime)
  startDateDiv.className = 'text-secondary mt-2'

  createMapImage(ride, 'mapDetailsContainer', true, true, false)

  dataElement.appendChild(cityDiv)
  dataElement.appendChild(maxSpeedDiv)
  dataElement.appendChild(distanceDiv)
  dataElement.appendChild(durationDiv)
  dataElement.appendChild(startDateDiv)

  containerElement.appendChild(dataElement)

  return containerElement
}
