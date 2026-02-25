const { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command, GetObjectCommand, HeadBucketCommand, CreateBucketCommand, PutBucketPolicyCommand } = require('@aws-sdk/client-s3');

let s3Client = null;
let bucketName = null;

function getS3Client() {
  if (s3Client) return s3Client;

  const endpoint = process.env.MINIO_ENDPOINT || 'localhost:9000';
  const accessKeyId = process.env.MINIO_ACCESS_KEY || 'minioadmin';
  const secretAccessKey = process.env.MINIO_SECRET_KEY || 'minioadmin';

  s3Client = new S3Client({
    endpoint: `http://${endpoint}`,
    region: 'us-east-1',
    credentials: {
      accessKeyId,
      secretAccessKey
    },
    forcePathStyle: true
  });

  bucketName = process.env.MINIO_BUCKET || 'ignacio-media';

  return s3Client;
}

async function ensureBucket() {
  const client = getS3Client();

  try {
    await client.send(new HeadBucketCommand({ Bucket: bucketName }));
    console.log(`Bucket ${bucketName} already exists`);
  } catch (error) {
    console.log(`Creating bucket ${bucketName}...`);
    await client.send(new CreateBucketCommand({ Bucket: bucketName }));
    console.log(`Bucket ${bucketName} created`);
  }

  const policy = {
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'PublicReadWrite',
        Effect: 'Allow',
        Principal: '*',
        Action: ['s3:GetObject', 's3:PutObject', 's3:DeleteObject'],
        Resource: [`arn:aws:s3:::${bucketName}/*`]
      }
    ]
  };

  try {
    await client.send(new PutBucketPolicyCommand({
      Bucket: bucketName,
      Policy: JSON.stringify(policy)
    }));
    console.log(`Bucket policy set for public read`);
  } catch (error) {
    console.log(`Could not set bucket policy:`, error.message);
  }
}

async function uploadFile(fileBuffer, filename, contentType) {
  const client = getS3Client();
  const key = `uploads/${Date.now()}-${filename}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType
  });

  await client.send(command);

  return {
    key,
    url: `${process.env.MINIO_PUBLIC_URL || `http://${process.env.MINIO_ENDPOINT || 'localhost:9000'}`}/${bucketName}/${key}`
  };
}

async function deleteFile(key) {
  const client = getS3Client();
  
  await client.send(new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key
  }));
}

async function listFiles(prefix = 'uploads/') {
  const client = getS3Client();
  
  try {
    const result = await client.send(new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix
    }));

    return (result.Contents || []).map(item => ({
      key: item.Key,
      size: item.Size,
      lastModified: item.LastModified
    }));
  } catch (error) {
    console.log('Error listing files:', error.message);
    return [];
  }
}

async function getFile(key) {
  const client = getS3Client();
  
  try {
    const response = await client.send(new GetObjectCommand({
      Bucket: bucketName,
      Key: key
    }));
    
    return response.Body;
  } catch (error) {
    console.log('Error getting file:', error.message);
    throw error;
  }
}

async function getFileUrl(key) {
  getS3Client();
  return `${process.env.MINIO_PUBLIC_URL || `http://${process.env.MINIO_ENDPOINT || 'localhost:9000'}`}/${bucketName}/${key}`;
}

module.exports = {
  getS3Client,
  ensureBucket,
  uploadFile,
  deleteFile,
  listFiles,
  getFile,
  getFileUrl
};
