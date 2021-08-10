import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import configuration from 'src/config/configuration';

AWS.config.update({
  accessKeyId: configuration().awsAccessKeyId,
  secretAccessKey: configuration().awsSecretAccessKey,
  region: configuration().awsS3Region,
});

@Injectable()
export class ImageService {
  async uploadImage(files) {
    return {
      statusCode: 201,
      message: '파일 S3 업로드 성공',
      fileName: files[0].originalname,
      location: files[0].location,
    };
  }
}
