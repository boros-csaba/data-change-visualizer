
import { Data } from './data.js';
import { Animation } from './animation.js';

async function downloadVideo() {

    let subtitle = document.getElementById('subtitle');

    subtitle.innerHTML = 'Verifying payment information...';
    let urlParams = new URLSearchParams(window.location.search);
    let paymentSessionId = urlParams.get('s');
    let paymentSessionData = await getPaymentSessionDataUrl(paymentSessionId);
    // todo handle failure
    let fileId = paymentSessionData.fileId;
    
    subtitle.innerHTML = 'Accessing video source data...';
    let sourceFileArrayBuffer = await downloadSourceFileFromS3(fileId);

    subtitle.innerHTML = 'Processing video...';
    let data = new Data(sourceFileArrayBuffer);
    let animation = new Animation("render", data);
    animation.download(
        () => {
            subtitle.innerHTML = 'Your download will start automatically.'
        }, 
        'download-button');

}

async function getPaymentSessionDataUrl(paymentSessionId) {
    const url = new URL(
        'https://xyfutw24tphoyemtrihfxll5pi0roycj.lambda-url.us-west-1.on.aws/'
    );

    let response = await fetch(url, {
        method: 'POST',
        body: paymentSessionId,
    });

    return response.json();
}

async function downloadSourceFileFromS3(fileId) {
    const url = new URL(
        'https://viral-chart-video-source-files.s3.us-west-1.amazonaws.com/' + fileId
    );

    let response = await fetch(url, {
        method: 'GET'
    });

    return response.arrayBuffer();
}

window.onload = downloadVideo();