const { randomUUID } = require('crypto');

exports.handler = async function (_) {

    const s3Policy = {
        Version: '2012-10-17',
        Statement: [{
            Effect: 'Allow',
            Action: 's3:GetObject',
            Resource: process.env.BUCKET_ARN + '/' + objectKey
        }]
    };

    var credentials = await new AWS.ChainableTemporaryCredentials({
        params: {
            RoleArn: process.env.PRESIGN_URL_ROLE_ARN,
            Policy: JSON.stringify(s3Policy),
            DurationSeconds: expireSeconds
        },
        Credentials: {
            AccessKeyId: AWS.config.credentials.AccessKeyId,
            SecretAccessKey: AWS.config.credentials.SecretAccessKey,
            SessionToken: AWS.config.credentials.SessionToken
        }
    });

    const s3 = new AWS.S3(new AWS.Config({
        credentials: credentials
    }));

    return await s3.getSignedUrl('putObject', {
        Bucket: process.env.BUCKET_NAME,
        Key: randomUUID
    });

}