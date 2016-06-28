'use strict'

let sc2ApiStatus = ''
let apiIconCheck = document.getElementById('icon-api-check')
let apiIconError = document.getElementById('icon-api-error')
let body = document.querySelector('body')
let bgArray = ['bg-1.jpg', 'bg-2.jpg', 'bg-3.jpg']
let httpRequest = new XMLHttpRequest()
httpRequest.onreadystatechange = checkStatus

function sendRequest() {
    httpRequest.open('GET', 'http://kuna-starcraft2.rhcloud.com/api/status', true)
    httpRequest.send(null);
}

function checkStatus() {
  console.log("ok")
    if (httpRequest.status === 200) {
        apiIconCheck.style.display = 'inline-block'
        apiIconError.style.display = 'none'
    } else {
        apiIconCheck.style.display = 'none'
        apiIconError.style.display = 'inline-block'
    }
}
sendRequest()
setInterval(sendRequest, 600000)

function changeBGImg() {
    var random = Math.floor(Math.random() * 3)
    body.style.backgroundImage = `url(../img/${bgArray[random]})`
}

setInterval(changeBGImg, 10000)