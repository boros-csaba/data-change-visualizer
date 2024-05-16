
async function downloadVideo() {

    let subtitle = document.getElementById('subtitle');

    subtitle.innerHTML = 'Verifying payment information...';
    let urlParams = new URLSearchParams(window.location.search);
    let paymentSessionId = urlParams.get('s');
    let paymentSessionData = await getPaymentSessionDataUrl(paymentSessionId);
    // todo handle failure

    let fileId = paymentSessionData.
    console.log(paymentSessionData);

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

window.onload = downloadVideo();