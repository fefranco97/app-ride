document.addEventListener('DOMContentLoaded', function () {
  const startButton = document.querySelector('#start')
  const stopButton = document.querySelector('#stop')
  const speedElement = document.querySelector('#speed')
  const speedMeassureElement = document.querySelector('#speedMeassure')
  const statisticsContainerElement = document.querySelector('#statistics-Container')
  const kilometersPerHour = 3.6

  let watchID = null

  const options = {
    enableHighAccuracy: true,
  }

  function handlerSuccess(position) {
    speedElement.innerText = position.coords.speed
      ? (position.coords.speed * kilometersPerHour).toFixed(1)
      : 0
  }
  function handlerError(error) {
    console.log(error.msg)
  }

  startButton.addEventListener('click', () => {
    if (watchID) return

    watchID = navigator.geolocation.watchPosition(handlerSuccess, handlerError, options)

    startButton.classList.add('d-none')
    stopButton.classList.remove('d-none')
  })

  stopButton.addEventListener('click', () => {
    if (!watchID) return
    navigator.geolocation.clearWatch(watchID)
    watchID = null
    stopButton.classList.add('d-none')
    startButton.classList.remove('d-none')
  })
})
