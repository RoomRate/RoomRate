const S3 = require(`aws-sdk/clients/s3`);
const config = require(`config`);
const region = config.get(`s3.region`) || process.env.S3_REGION;
const accessKeyId = config.get(`s3.aws-access-key`) || process.env.S3_AWS_ACCESS_KEY;
const secretAccessKey = config.get(`s3.aws-secret-key`) || process.env.S3_AWS_SECRET_KEY;

const s3 = new S3({ region, accessKeyId, secretAccessKey });

// uploads file to s3
exports.s3Upload = async ({ file, imageKey, mimetype }) => {
  const uploadImage = await s3.upload({
    Bucket: config.get(`s3.bucket_name`) || process.env.S3_BUCKET_NAME,
    Key: imageKey,
    Body: file,
    ContentType: mimetype,
  }).promise();

  return uploadImage;
};

// downloads file from s3

exports.s3download = async (imgKey) => {
  const image = await s3.getObject({
    Bucket: config.get(`s3.bucket_name`) || process.env.S3_BUCKET_NAME,
    Key: imgKey,
  }).promise();

  const buf = Buffer.from(image.Body);
  const base64 = buf.toString(`base64`);

  return base64;
};
