import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Video } from './entities/video.entity';
import { CreateVideoDto } from './dto/create-video.dto';
import { User } from 'src/users/entities/user.entity';
import { Follow } from 'src/follow/entities/follow.entity';
import { VideoLike } from 'src/video-like/entities/video-like.entity';
import { Tag } from 'src/tags/entities/tags.entity';
import jwtDecode from 'jwt-decode';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Video)
    private readonly videosRepository: Repository<Video>,

    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,

    @InjectRepository(VideoLike)
    private readonly videoLikeRepository: Repository<VideoLike>,

    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(
    createVideoDto: CreateVideoDto,
    location: string,
  ): Promise<Video> {
    const video = this.videosRepository.create();
    const videoUserId = createVideoDto.userId;
    const user = await this.usersRepository.findOne(videoUserId);
    if (!user)
      throw new HttpException(
        {
          statusCode: 404,
          message: '사용자 정보 없음',
          error: 'USER-001',
          data: createVideoDto,
        },
        404,
      );
    video.user = user;
    video.userId = videoUserId;
    video.videoName = createVideoDto.videoName;
    video.category = createVideoDto.category;
    video.src = location;
    if (createVideoDto.videoIntro) video.videoIntro = createVideoDto.videoIntro;
    return await this.videosRepository.save(video);
  }

  async findAll(start: number, end: number) {
    const videos = await this.videosRepository.find({
      where: { id: Between(start, end) },
      order: { likes: 'DESC' },
    });
    const videosData = await Promise.all(
      videos.map(async (video) => {
        const users = await this.usersRepository.findOne(video.userId);
        const hashTags = await this.tagRepository.find({
          select: ['tagName'],
          where: { videoId: video.id },
        });
        return Object.assign(video, {
          hashTags: hashTags.map(({ tagName }) => tagName),
          relation: { isFollow: false, isLike: false },
          poster: {
            name: users.userName,
            picture: users.userPhotoURL,
            followNum: users.followerCount,
          },
        });
      }),
    );
    return videosData;
  }

  async findAllOnUser(loginData: any, start: number, end: number) {
    const loginUser = await this.usersRepository.findOne(loginData);
    if (loginUser.userId !== loginData)
      throw new HttpException(
        {
          statusCode: 404,
          message: '사용자 정보 없음',
          error: 'USER-001',
          data: { loginData: loginData, start: start, end: end },
        },
        404,
      );
    const videos = await this.videosRepository.find({
      id: Between(start, end),
    });
    const videosData = await Promise.all(
      videos.map(async (video) => {
        const isFollow = await this.isFollow(loginUser.userId, video.userId);
        const isLike = await this.isLike(
          loginUser.userId,
          video.userId,
          video.id,
        );
        const users = await this.usersRepository.findOne(video.userId);
        if (!users)
          throw new HttpException(
            {
              statusCode: 404,
              message: '사용자 정보 없음',
              error: 'USER-001',
              data: { loginData: loginData, start: start, end: end },
            },
            404,
          );
        const hashTags = await this.tagRepository.find({
          select: ['tagName'],
          where: { videoId: video.id },
        });
        return Object.assign(video, {
          hashTags: hashTags.map(({ tagName }) => tagName),
          relation: { isFollow: isFollow, isLike: isLike },
          poster: {
            name: users.userName,
            picture: users.userPhotoURL,
            followNum: users.followerCount,
          },
        });
      }),
    );
    return videosData;
  }

  async findAllOnUserRecommand(loginData: any, start: number, end: number) {
    const loginUser = await this.usersRepository.findOne(loginData.id);
    if (loginUser.userId !== loginData.id)
      throw new HttpException(
        {
          statusCode: 404,
          message: '사용자 정보 없음',
          error: 'USER-001',
          data: { loginData: loginData, start: start, end: end },
        },
        404,
      );

    const videosLikeLOL = await this.videoLikeRepository
      .createQueryBuilder('vl')
      .innerJoin(User, 'u', 'vl.userId = u.userId')
      .innerJoin(Video, 'v', 'vl.videoId = v.id')
      .select([
        'u.lolTier AS lolTier',
        'count(vl.videoId) AS cnt',
        'vl.videoId AS id',
        'v.createTime AS createTime',
        'v.updateTime AS updateTime',
        'v.views AS views',
        'v.videoName AS videoName',
        'v.src AS src',
        'v.category AS category',
        'v.videoIntro AS videoIntro',
        'v.userId AS userId',
        'v.likes AS likes',
        'v.comments AS comments',
      ])
      .where('v.category =:lol', { lol: 'lol' })
      .groupBy('vl.videoId, u.lolTier')
      .having('u.lolTier=:lolTier', { lolTier: loginData.lolTier })
      .orderBy('cnt', 'DESC')
      .getRawMany();

    const videosLikePUBG = await this.videoLikeRepository
      .createQueryBuilder('vl')
      .innerJoin(User, 'u', 'vl.userId = u.userId')
      .innerJoin(Video, 'v', 'vl.videoId = v.id')
      .select([
        'u.pubgTier AS pubgTier',
        'count(vl.videoId) AS cnt',
        'vl.videoId AS id',
        'v.createTime AS createTime',
        'v.updateTime AS updateTime',
        'v.views AS views',
        'v.videoName AS videoName',
        'v.src AS src',
        'v.category AS category',
        'v.videoIntro AS videoIntro',
        'v.userId AS userId',
        'v.likes AS likes',
        'v.comments AS comments',
      ])
      .where('v.category =:pubg', { pubg: 'pubg' })
      .groupBy('vl.videoId, u.pubgTier')
      .having('u.pubgTier=:pubgTier', { pubgTier: loginData.pubgTier })
      .orderBy('cnt', 'DESC')
      .getRawMany();

    const videosLikeWatch = await this.videoLikeRepository
      .createQueryBuilder('vl')
      .innerJoin(User, 'u', 'vl.userId = u.userId')
      .innerJoin(Video, 'v', 'vl.videoId = v.id')
      .select([
        'u.watchTier AS watchTier',
        'count(vl.videoId) AS cnt',
        'vl.videoId AS id',
        'v.createTime AS createTime',
        'v.updateTime AS updateTime',
        'v.views AS views',
        'v.videoName AS videoName',
        'v.src AS src',
        'v.category AS category',
        'v.videoIntro AS videoIntro',
        'v.userId AS userId',
        'v.likes AS likes',
        'v.comments AS comments',
      ])
      .where('v.category =:overwatch', { overwatch: 'overwatch' })
      .groupBy('vl.videoId, u.watchTier')
      .having('u.watchTier=:watchTier', { watchTier: loginData.watchTier })
      .orderBy('cnt', 'DESC')
      .getRawMany();
    const videosDataLOL = await Promise.all(
      videosLikeLOL.map(async (video) => {
        const isFollow = await this.isFollow(loginUser.userId, video.userId);
        const isLike = await this.isLike(
          loginUser.userId,
          video.userId,
          video.id,
        );
        const users = await this.usersRepository.findOne(video.userId);
        if (!users)
          throw new HttpException(
            {
              statusCode: 404,
              message: '사용자 정보 없음',
              error: 'USER-001',
              data: { loginData: loginData, start: start, end: end },
            },
            404,
          );
        const hashTags = await this.tagRepository.find({
          select: ['tagName'],
          where: { videoId: video.id },
        });
        return Object.assign(video, {
          hashTags: hashTags.map(({ tagName }) => tagName),
          relation: { isFollow: isFollow, isLike: isLike },
          poster: {
            name: users.userName,
            picture: users.userPhotoURL,
            followNum: users.followerCount,
          },
        });
      }),
    );

    const videosDataPUBG = await Promise.all(
      videosLikePUBG.map(async (video) => {
        const isFollow = await this.isFollow(loginUser.userId, video.userId);
        const isLike = await this.isLike(
          loginUser.userId,
          video.userId,
          video.id,
        );
        const users = await this.usersRepository.findOne(video.userId);
        if (!users)
          throw new HttpException(
            {
              statusCode: 404,
              message: '사용자 정보 없음',
              error: 'USER-001',
              data: { loginData: loginData, start: start, end: end },
            },
            404,
          );
        const hashTags = await this.tagRepository.find({
          select: ['tagName'],
          where: { videoId: video.id },
        });
        return Object.assign(video, {
          hashTags: hashTags.map(({ tagName }) => tagName),
          relation: { isFollow: isFollow, isLike: isLike },
          poster: {
            name: users.userName,
            picture: users.userPhotoURL,
            followNum: users.followerCount,
          },
        });
      }),
    );

    const videosDataWatch = await Promise.all(
      videosLikeWatch.map(async (video) => {
        const isFollow = await this.isFollow(loginUser.userId, video.userId);
        const isLike = await this.isLike(
          loginUser.userId,
          video.userId,
          video.id,
        );
        const users = await this.usersRepository.findOne(video.userId);
        if (!users)
          throw new HttpException(
            {
              statusCode: 404,
              message: '사용자 정보 없음',
              error: 'USER-001',
              data: { loginData: loginData, start: start, end: end },
            },
            404,
          );
        const hashTags = await this.tagRepository.find({
          select: ['tagName'],
          where: { videoId: video.id },
        });
        return Object.assign(video, {
          hashTags: hashTags.map(({ tagName }) => tagName),
          relation: { isFollow: isFollow, isLike: isLike },
          poster: {
            name: users.userName,
            picture: users.userPhotoURL,
            followNum: users.followerCount,
          },
        });
      }),
    );
    return {
      lolRecommand: videosDataLOL,
      pubgRecommand: videosDataPUBG,
      watchRecommand: videosDataWatch,
    };
  }

  async findSearchAll(start: number, end: number, userId: string) {
    const videos = await this.videosRepository.find({
      id: Between(start, end),
      userId: userId,
    });
    const videosData = await Promise.all(
      videos.map(async (video) => {
        const users = await this.usersRepository.findOne(video.userId);
        const hashTags = await this.tagRepository.find({
          select: ['tagName'],
          where: { videoId: video.id },
        });
        return Object.assign(video, {
          hashTags: hashTags.map(({ tagName }) => tagName),
          relation: { isFollow: false, isLike: false },
          poster: {
            name: users.userName,
            picture: users.userPhotoURL,
            followNum: users.followerCount,
          },
        });
      }),
    );
    return videosData;
  }

  async findSearchUser(
    loginData: any,
    start: number,
    end: number,
    userId: string,
  ) {
    const loginUser = await this.usersRepository.findOne(loginData);
    if (loginUser.userId !== loginData)
      throw new HttpException(
        {
          statusCode: 404,
          message: '사용자 정보 없음',
          error: 'USER-001',
          data: {
            loginData: loginData,
            userId: userId,
            start: start,
            end: end,
          },
        },
        404,
      );
    const videos = await this.videosRepository.find({
      id: Between(start, end),
      userId: userId,
    });
    const videosData = await Promise.all(
      videos.map(async (video) => {
        const isFollow = await this.isFollow(loginUser.userId, video.userId);
        const isLike = await this.isLike(
          loginUser.userId,
          video.userId,
          video.id,
        );
        const users = await this.usersRepository.findOne(video.userId);
        if (!users)
          throw new HttpException(
            {
              statusCode: 404,
              message: '비디오 사용자 정보 없음',
              error: 'USER-001',
              data: {
                loginData: loginData,
                userId: video.userId,
                start: start,
                end: end,
              },
            },
            404,
          );
        const hashTags = await this.tagRepository.find({
          select: ['tagName'],
          where: { videoId: video.id },
        });
        return Object.assign(video, {
          hashTags: hashTags.map(({ tagName }) => tagName),
          relation: { isFollow: isFollow, isLike: isLike },
          poster: {
            name: users.userName,
            picture: users.userPhotoURL,
            followNum: users.followerCount,
          },
        });
      }),
    );
    return videosData;
  }

  async findOne(id: number): Promise<Video> {
    if (isNaN(id))
      throw new HttpException(
        {
          statusCode: 400,
          message: '비디오 입력정보 오류',
          error: 'INPUT-004',
          data: id,
        },
        400,
      );
    const video = await this.videosRepository.findOne(id);
    if (!video)
      throw new HttpException(
        {
          statusCode: 404,
          message: '비디오 정보 없음',
          error: 'VIDEO-001',
          data: id,
        },
        404,
      );
    return video;
  }

  async findUserVideos(userId: string): Promise<Video[]> {
    const user = await this.usersRepository.findOne(userId);
    if (!user)
      throw new HttpException(
        {
          statusCode: 404,
          message: '비디오 사용자 정보 없음',
          error: 'USER-001',
          data: userId,
        },
        404,
      );
    const videos = await this.videosRepository.find({
      where: { user: user },
    });
    const videosData = await Promise.all(
      videos.map(async (video) => {
        const users = await this.usersRepository.findOne(video.userId);
        const hashTags = await this.tagRepository.find({
          select: ['tagName'],
          where: { videoId: video.id },
        });
        return Object.assign(video, {
          hashTags: hashTags.map(({ tagName }) => tagName),
          relation: { isFollow: false, isLike: false },
          poster: {
            name: users.userName,
            picture: users.userPhotoURL,
            followNum: users.followerCount,
          },
        });
      }),
    );
    return videosData;
  }

  async remove(id: number): Promise<void> {
    if (isNaN(id))
      throw new HttpException(
        {
          statusCode: 400,
          message: '비디오 입력정보 오류',
          error: 'INPUT-004',
          data: id,
        },
        400,
      );
    const video = await this.videosRepository.findOne(id);
    if (!video)
      throw new HttpException(
        {
          statusCode: 404,
          message: '비디오 정보 없음',
          error: 'USER-001',
          data: id,
        },
        404,
      );
    await this.videosRepository.delete(id);
  }

  async increaseViews(id: number): Promise<void> {
    if (isNaN(id))
      throw new HttpException(
        {
          statusCode: 400,
          message: '비디오 입력정보 오류',
          error: 'INPUT-004',
          data: id,
        },
        400,
      );
    const videoToUpdate = await this.videosRepository.findOne(id);
    if (!videoToUpdate)
      throw new HttpException(
        {
          statusCode: 404,
          message: '업데이트할 비디오 정보 없음',
          error: 'VIDEO-001',
          data: id,
        },
        404,
      );
    videoToUpdate.views++;
    await this.videosRepository.save(videoToUpdate);
  }

  async isFollow(userId: string, followingId: string) {
    const validFollow = await this.followRepository.findOne({
      userId: userId,
      followingId: followingId,
    });
    if (validFollow) return true;
    else return false;
  }

  //check this videolike data is valid
  async isLike(
    userId: string,
    likeId: string,
    videoId: number,
  ): Promise<boolean> {
    const like = await this.videoLikeRepository.findOne({
      userId: userId,
      likeId: likeId,
      videoId: videoId,
    });
    if (like) return true;
    else return false;
  }

  async findTokenId(req: any) {
    const header = req.headers.authorization;
    if (header !== undefined) {
      const validToken = header.split(' ');
      if (validToken[1] !== 'undefined') {
        try {
          const token = jwtDecode(header);
          return token['userId'];
        } catch (err) {
          throw new HttpException(
            {
              statusCode: 404,
              message: '토큰 정보 없음',
              error: 'TOKEN-001',
            },
            404,
          );
        }
      } else {
        return 'no-data';
      }
    } else {
      return 'no-data';
    }
  }

  async findTokenDetails(req: any) {
    const header = req.headers.authorization;
    if (header !== undefined) {
      const validToken = header.split(' ');
      if (validToken[1] !== 'undefined') {
        try {
          const token = jwtDecode(header);
          return {
            id: token['userId'],
            feed: token['userFeed'],
            lolTier: token['lolTier'],
            pubgTier: token['pubgTier'],
            watchTier: token['watchTier'],
          };
        } catch (err) {
          throw new HttpException(
            {
              statusCode: 404,
              message: '토큰 정보 없음',
              error: 'TOKEN-001',
            },
            404,
          );
        }
      } else {
        return 'no-data';
      }
    } else {
      return 'no-data';
    }
  }
}
