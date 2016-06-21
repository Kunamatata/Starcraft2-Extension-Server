'use strict'

let sc2ApiStatus = ''
let statusDiv = document.getElementById('api-status')
let httpRequest = new XMLHttpRequest()
httpRequest.onreadystatechange = checkStatus;

function sendRequest() {
  httpRequest.open('GET', 'http://kuna-starcraft2.rhcloud.com/api/status', true)
  httpRequest.send(null);
}

function checkStatus() {
  if (httpRequest.status === 200) {
    statusDiv.style.backgroundColor = "green"
  } else {
    statusDiv.style.backgroundColor = "red"
  }
}

setInterval(sendRequest, 600000)