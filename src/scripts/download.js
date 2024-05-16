
function downloadVideo() {

    let subtitle = document.getElementById('subtitle');

    subtitle.innerHTML = 'Verifying payment information...';
    let urlParams = new URLSearchParams(window.location.search);
    let paymentSessionId = urlParams.get('s');
    

}

window.onload = downloadVideo();