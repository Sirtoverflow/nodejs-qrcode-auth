
const urlParams = new URLSearchParams(window.location.search);
const paramUser = urlParams.get('username');
const paramToken = urlParams.get('token');

document.getElementById('username').innerHTML = paramUser;

if (!paramUser) {    
    window.location.href = '/login';
}

const getAllInfo = () => {
    var user = paramUser;
    var token = paramToken;
    return `{ "username": "${user}", "token": "${token}" }`;
}

var settingbtn = document.querySelector('.setting-icon');
var settingPopUp = document.querySelector('.settingBox');
var PopUpContent = document.querySelector('.settingBox-content-item');
var showQRcode = document.getElementById('QRcodeshow');
var qrImage = document.createElement('img');

settingbtn.addEventListener('click', () => {
    settingPopUp.classList.toggle('active');
})

qrImage.src = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' + getAllInfo();
qrImage.style.position = 'absolute';
qrImage.style.top = '60px';
qrImage.style.left = '45px';

showQRcode.addEventListener('click', () => {
    PopUpContent.innerHTML = '';
    PopUpContent.appendChild(qrImage);
    settingPopUp.classList.toggle('active');
})