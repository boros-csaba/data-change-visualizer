import '../styles/styles.scss';
import { Animation } from './animation.js';
import { FileUploadHandler } from './file-upload-handler.js';
import { download } from './video.js';

const myApp = {
    uploadedRawFileData: null,
};

const animation = new Animation();
const fileUploadHandler = new FileUploadHandler(
    (rawFileData) => (myApp.uploadedRawFileData = rawFileData)
);
fileUploadHandler.initFileUploadInput(animation);
animation.startAnimation();

window.onload = () => {
    document
        .getElementsByClassName('download-button')[0]
        .addEventListener('click', async () => {
            let uploadUrl = await getS3PresignedUrl();
            await uploadDataToS3(uploadUrl);
            download();
        });
};

async function getS3PresignedUrl() {
    const url = new URL(
        'https://5cf4ly6ngsvgtzjwh3xmjye6ki0hjkah.lambda-url.us-west-1.on.aws/'
    );
    let response = await fetch(url, {
        method: 'POST',
    });

    return response.text();
}

async function uploadDataToS3(s3Url) {
    const url = new URL(s3Url);
    let response = await fetch(url, {
        method: 'PUT',
        body: animation.getVideoBlob(),
    });

    return response.text();
}
