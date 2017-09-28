const apiURL = 'https://kuna-starcraft2.rhcloud.com/api';
const apiIconCheck = document.getElementById('icon-api-check');
const apiIconError = document.getElementById('icon-api-error');
const body = document.querySelector('body');
const bgArray = ['bg-1.jpg', 'bg-2.jpg', 'bg-3.jpg', 'bg-4.jpg'];
const httpRequest = new XMLHttpRequest();

function sendRequest() {
  httpRequest.open('GET', `${apiURL}/status`, true);
  httpRequest.send(null);
}

function checkStatus() {
  if (httpRequest.status === 200) {
    apiIconCheck.style.display = 'inline-block';
    apiIconError.style.display = 'none';
  } else {
    apiIconCheck.style.display = 'none';
    apiIconError.style.display = 'inline-block';
  }
}

httpRequest.onreadystatechange = checkStatus;

sendRequest();
setInterval(sendRequest, 600000);

let prev = 0;

function changeBGImg() {
  let random = Math.floor(Math.random() * 4);

  while (prev === random) {
    random = Math.floor(Math.random() * 4);
  }

  body.style.backgroundImage = `url(../img/${bgArray[random]})`;
  prev = random;
}

setInterval(changeBGImg, 5000);
