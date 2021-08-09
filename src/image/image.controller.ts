import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { ImageService } from 'src/image/image.service';
import * as multerS3 from 'multer-s3';
import * as AWS from 'aws-sdk';
import configuration from 'src/config/configuration';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { userRole } from 'src/auth/role.decorator';
import { Role } from 'src/users/entities/user.entity';

//file upload Api body에 맞추기 위한 Dto 선언
export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary', name: 'image' })
  file: any;
}

const s3 = new AWS.S3();

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}
  @ApiTags('프로필 이미지 업로드(Upload)')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: ' image upload',
    type: FileUploadDto,
  })
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '사용자 프로필 업로드',
    description: '프로필 사진 업로드를 진행한다',
  })
  @ApiResponse({
    status: 201,
    description: 'AWS S3 파일 업로드',
  })
  @ApiInternalServerErrorResponse({
    description: '서버 오류',
  })
  @Post('/upload')
  @userRole(Role.USER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @UseInterceptors(
    FilesInterceptor('image', 1, {
      storage: multerS3({
        s3: s3,
        bucket: configuration().awsS3BucketName,
        acl: 'public-read',
        key: function (req, file, cb) {
          //req is essential
          cb(null, `images/${Date.now().toString()}-${file.originalname}`);
        },
      }),
    }),
  )
  async uploadImage(@UploadedFiles() file: Express.Multer.File) {
    try {
      const upload = await this.imageService.uploadImage(file);
      return upload;
    } catch (err) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: err.message,
        },
        err.status,
      );
    }
  }
}
