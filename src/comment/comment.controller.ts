import {
  Body,
  Controller,
  HttpException,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { userRole } from 'src/auth/role.decorator';
import { RoleGuard } from 'src/auth/role.guard';
import { Role } from 'src/users/entities/user.entity';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@ApiTags('Comment (댓글)')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiResponse({ status: 201, description: '댓글입력 성공' })
  @ApiResponse({ status: 400, description: '입력데이터 오류' })
  @ApiResponse({ status: 401, description: '권한 오류' })
  @ApiResponse({ status: 404, description: '사용자 없음' })
  @ApiResponse({ status: 404, description: '비디오 없음' })
  @ApiResponse({ status: 407, description: '코멘트 중복' })
  @ApiOperation({
    description: '특정 비디오에 댓글을 입력한다.',
    summary: '댓글작성',
  })
  @ApiBody({
    type: CreateCommentDto,
    description:
      '사용자ID(userId), 댓글 작성할 videoId (videoId), 내용 (content)',
  })
  @ApiBearerAuth('access-token')
  @userRole(Role.USER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('/create')
  async create(@Body() commentData: CreateCommentDto) {
    try {
      await this.commentService.createComment(commentData);
      return {
        statusCode: 201,
        message: '댓글 작성 성공',
        data: commentData,
      };
    } catch (err) {
      throw new HttpException(
        {
          statusCode: err.status,
          message: err.message,
          data: commentData,
        },
        err.status,
      );
    }
  }
}
