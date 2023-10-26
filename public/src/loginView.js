
var videoStream; // Declare a global variable to store the camera stream
var qrCodeScanner; // Declare a variable to store the QR code scanner object

var video = document.getElementById('video');
var canvasElement = document.getElementById("canvas");
var canvas = canvasElement.getContext("2d");
var loadingMessage = document.getElementById("loadingMessage");
var outputContainer = document.getElementById("output");
var outputMessage = document.getElementById("outputMessage");
var outputData = document.getElementById("outputData"); 


var qrcodeLogin = document.getElementById("qrcodeLogin");
const urlParams = new URLSearchParams(window.location.search);
const paramErrorCode = urlParams.get('error');
if (paramErrorCode) {
    document.getElementById('error-code').innerHTML = 'username or password is incorrect';
}

function toggleCamera() {
    const constraints = {
        video: {
            facingMode: videoStream ? 'user' : 'environment', // Toggle between 'user' and 'environment'
            width: { ideal: 1280 },
            height: { ideal: 720 }
        },
        audio: false
    };

    if (!videoStream) {
        // Start the camera
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia(constraints)
                .then(function (stream) {
                    videoStream = stream; // Store the stream in the global variable
                    video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
                    
                    video.srcObject = stream;
                    video.onloadedmetadata = function (e) {
                        const playPromise = video.play();
                        if (playPromise !== undefined) {
                            playPromise.then(_ => {
                                requestAnimationFrame(tick);
                            }).catch(error => {
                                console.error('Video playback error: ', error);
                            });
                        }
                    };
                })
                .catch(function (error) {
                    alert('You have to enable the microphone and the camera');
                });
        } else {
            alert('Your browser does not support getUserMedia');
        }
        } else {
            // Stop the camera
            const tracks = videoStream.getTracks();
            tracks.forEach(track => track.stop());
            videoStream = null; // Reset the global variable
        }
    }

function drawLine(begin, end, color) {
    canvas.beginPath();
    canvas.moveTo(begin.x, begin.y);
    canvas.lineTo(end.x, end.y);
    canvas.lineWidth = 4;
    canvas.strokeStyle = color;
    canvas.stroke();
}

function tick() {
    loadingMessage.innerText = "⌛ Loading video..."
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        loadingMessage.hidden = true;
        canvasElement.hidden = false;
        outputContainer.hidden = false;
        video.hidden = true;

        canvasElement.height = video.videoHeight/2;
        canvasElement.width = video.videoWidth/2;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        var code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });
        if (code) {
            drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
            drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
            drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
            drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
            handleQrCodeData(code.data);
        }
    }
    requestAnimationFrame(tick);
}

var countFail = 0;  

function handleQrCodeData(data) {
    const currentQRCode = data;
    const patternDataValid = /{"[^"]+":"[^"]+","[^"]+":"[^"]+"}/g;
    // const match = currentQRCode.match(patternDataValid);
    
    // if(match){
    //     console.log('QR code is valid');
    //     window.location.href = `/login?qrcode=${currentQRCode}`;
    // }else{
    //     //match = null
    //     countFail++;
    //     if(countFail > 100){
    //         countFail = 0;
    //         alert('QR code is not valid');
    //     }
    //     console.log('QR code is not valid');
    // }
    console.log('QR code is valid');
    console.log(currentQRCode);
    window.location.href = `/login?qrcode=${currentQRCode}`;
}
