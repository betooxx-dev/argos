import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import {
  BlogComment,
  BlogPost,
  BlogRating,
  BlogRecommendation,
} from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BlogPost,
      BlogComment,
      BlogRating,
      BlogRecommendation,
    ]),
  ],
  controllers: [BlogsController],
  providers: [BlogsService],
  exports: [BlogsService],
})
export class BlogsModule {}
