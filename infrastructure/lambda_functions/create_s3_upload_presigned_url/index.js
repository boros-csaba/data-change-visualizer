const { randomUUID } = require('crypto');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({ region: process.env.AWS_REGION });

exports.handler = async function (_) {

    const key = randomUUID();
    const command = new PutObjectCommand({ Bucket: process.env.BUCKET_NAME, Key: key });
    const url = getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return {
        statusCode: 200,
        body: JSON.stringify(url)
    }

}