import 'dotenv/config';
export default () => ({
  database: {
    host: process.env.DATABASE_HOST || '',
    user: process.env.DATABASE_USER || '',
    name: process.env.DATABASE_NAME || '',
    password: process.env.DATABASE_PASSWORD || '',
    port: process.env.DATABASE_PORT || '',
  },
  jwtConstants: {
    secret: process.env.JWT_SECRET_KEY || '',
  },
  bcryptConstant: {
    saltOrRounds: Number(process.env.BCRYPT_CONSTANT_VALUE),
  },
  expirationTime: process.env.JWT_EXPIRATION_TIME,
  awsS3BucketName: process.env.AWS_S3_BUCKET_NAME,
  awsS3Region: process.env.AWS_REGION,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
