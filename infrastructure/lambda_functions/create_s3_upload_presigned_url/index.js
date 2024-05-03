const { randomUUID } = require('crypto');
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({ region: process.env.BUCKET_NAME });

exports.handler = async function (_) {

    const key = randomUUID();
    const command = new PutObjectCommand({ Bucket: process.env.BUCKET_NAME, Key: key });
    return getSignedUrl(s3Client, command, { expiresIn: 3600 });

}