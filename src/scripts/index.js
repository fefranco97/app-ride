const rideListContainer = document.querySelector('#rideList')
const rideRecords = getAllRidesRecords()

processRideRecords(rideRecords)

function processRideRecords(rideRecords) {
  rideRecords.forEach(async ([id, value]) => {
    const ride = JSON.parse(value)
    ride.id = id
    const rideElement = await createRideElement(ride)

    rideListContainer.appendChild(rideElement)
    const mapId = `map-${ride.id}`
    createMapImage(ride, mapId, false, false, true)
  })
}

async function createRideElement(ride) {
  const itemElement = document.createElement('li')
  itemElement.id = ride.id
  itemElement.className =
    'd-flex p-2 align-items-center justify-content-between gap-3 m-2 border border-2 rounded shadow user-select-none'

  itemElement.addEventListener('click', () => {
    window.location.href = `src/pages/details.html?id=${ride.id}`
  })

  const mapElement = document.createElement('div')
  mapElement.classList.add('map')
  mapElement.id = `map-${ride.id}`

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

  dataElement.appendChild(cityDiv)
  dataElement.appendChild(maxSpeedDiv)
  dataElement.appendChild(distanceDiv)
  dataElement.appendChild(durationDiv)
  dataElement.appendChild(startDateDiv)

  itemElement.appendChild(mapElement)
  itemElement.appendChild(dataElement)

  return itemElement
}
