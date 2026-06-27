import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import { Public } from '@/modules/api-keys/decorators/public.decorator';
import { RequireScopes } from '@/modules/api-keys/decorators/require-scopes.decorator';
import {
  BlogLocaleQueryDto,
  BlogPostParamsDto,
  CreateBlogCommentDto,
  CreateBlogRatingDto,
  CreateBlogRecommendationDto,
} from './dto';
import { BlogsService } from './blogs.service';

@Controller('blog')
export class BlogsController {
  constructor(private readonly blogs: BlogsService) {}

  @Public()
  @Get('posts')
  findPublishedPosts(@Query() query: BlogLocaleQueryDto) {
    return this.blogs.findPublishedByLocale(query.locale);
  }

  @Public()
  @Get('tags')
  getTags(@Query() query: BlogLocaleQueryDto) {
    return this.blogs.getAllTags(query.locale);
  }

  @Public()
  @Get('posts/:locale/:slug')
  getPostBySlug(@Param() params: BlogPostParamsDto) {
    return this.blogs.findPublishedBySlug(params.locale, params.slug);
  }

  @Public()
  @Get('posts/:locale/:slug/related')
  getRelatedPosts(@Param() params: BlogPostParamsDto) {
    return this.blogs.getRelatedPosts(params.locale, params.slug);
  }

  @Public()
  @Get('posts/:locale/:slug/comments')
  getApprovedComments(@Param() params: BlogPostParamsDto) {
    return this.blogs.getApprovedComments(params.locale, params.slug);
  }

  @Public()
  @Post('posts/:locale/:slug/comments')
  createComment(
    @Param() params: BlogPostParamsDto,
    @Body() dto: CreateBlogCommentDto,
  ) {
    return this.blogs.createComment(params.locale, params.slug, dto);
  }

  @Public()
  @Post('posts/:locale/:slug/ratings')
  createRating(
    @Param() params: BlogPostParamsDto,
    @Body() dto: CreateBlogRatingDto,
  ) {
    return this.blogs.createRating(params.locale, params.slug, dto);
  }

  @Public()
  @Post('posts/:locale/:slug/recommendations')
  recommendPost(
    @Param() params: BlogPostParamsDto,
    @Body() dto: CreateBlogRecommendationDto,
  ) {
    return this.blogs.recommendPost(params.locale, params.slug, dto);
  }

  @RequireScopes('blog:admin')
  @Post('admin/seed')
  seed() {
    return this.blogs.seedInitialPosts();
  }

  @RequireScopes('blog:admin')
  @Delete('admin/reset')
  reset() {
    return this.blogs.resetBlogContent();
  }
}
