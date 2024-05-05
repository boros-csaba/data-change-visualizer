import '../styles/styles.scss';
import { Animation } from './animation.js';
import { FileUploadHandler } from './file-upload-handler.js';
import { download } from './video.js';

const app = {
    uploadedRawFileData: null,
};

const animation = new Animation();
const fileUploadHandler = new FileUploadHandler(
    (rawFileData) => (app.uploadedRawFileData = rawFileData)
);
fileUploadHandler.initFileUploadInput(animation);
animation.startAnimation();

window.onload = () => {
    document
        .getElementsByClassName('download-button')[0]
        .addEventListener('click', async () => {

            let uploadUrl = await getS3PresignedUrl();
            await uploadDataToS3(uploadUrl);
            const fileId = new URL(uploadUrl).pathname.split('/').pop();
            await initiatePayment(fileId);

            //download();
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
        body: new File([app.uploadedRawFileData], 'file'),
    });

    return response.text();
}

async function initiatePayment(fileId) {
    const url = new URL(
        'https://6jizzqdpcxsrn2fe5nqo6cjvay0duknl.lambda-url.us-west-1.on.aws/'
    );

    let response = await fetch(url, {
        method: 'POST',
        headers: {
            body: fileId
        },
    });

    console.log(response);
}
