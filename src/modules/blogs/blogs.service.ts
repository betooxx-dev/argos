import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  BlogComment,
  BlogPost,
  BlogRating,
  BlogRecommendation,
} from './entities';
import {
  BlogLocale,
  BlogPostStatus,
  CreateBlogCommentDto,
  CreateBlogRatingDto,
  CreateBlogRecommendationDto,
} from './dto';
import { blogSeedPosts } from './seeds/blog.seed';

export type BlogCommentResponse = {
  id: string;
  author: string;
  date: string;
  body: string;
};

export type BlogPostResponse = {
  id: string;
  slug: string;
  locale: BlogLocale;
  title: string;
  excerpt: string;
  content: string[];
  date: string;
  publishedAt: string;
  readingTime: string;
  category: string;
  tags: string[];
  cover: string;
  featured: boolean;
  rating: number;
  ratingCount: number;
  related: string[];
  comments: BlogCommentResponse[];
  status: BlogPostStatus;
  createdAt: string;
  updatedAt: string;
};

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(BlogPost)
    private readonly posts: Repository<BlogPost>,
    @InjectRepository(BlogComment)
    private readonly comments: Repository<BlogComment>,
    @InjectRepository(BlogRating)
    private readonly ratings: Repository<BlogRating>,
    @InjectRepository(BlogRecommendation)
    private readonly recommendations: Repository<BlogRecommendation>,
  ) {}

  async findPublishedByLocale(locale: BlogLocale): Promise<BlogPostResponse[]> {
    const posts = await this.posts.find({
      where: { locale, status: BlogPostStatus.PUBLISHED },
      relations: { comments: true, relatedPosts: true },
      order: { publishedAt: 'DESC' },
    });

    return posts.map((post) => this.toResponse(post));
  }

  async findPublishedBySlug(
    locale: BlogLocale,
    slug: string,
  ): Promise<BlogPostResponse> {
    const post = await this.findPublishedEntityBySlug(locale, slug);
    return this.toResponse(post);
  }

  async getAllTags(locale: BlogLocale): Promise<string[]> {
    const posts = await this.findPublishedByLocale(locale);
    return Array.from(new Set(posts.flatMap((post) => post.tags))).sort();
  }

  async getRelatedPosts(
    locale: BlogLocale,
    slug: string,
  ): Promise<BlogPostResponse[]> {
    const post = await this.findPublishedEntityBySlug(locale, slug);
    const related = (post.relatedPosts ?? []).filter(
      (relatedPost) =>
        relatedPost.locale === locale &&
        relatedPost.status === BlogPostStatus.PUBLISHED,
    );

    return related.map((relatedPost) => this.toResponse(relatedPost));
  }

  async getApprovedComments(
    locale: BlogLocale,
    slug: string,
  ): Promise<BlogCommentResponse[]> {
    const post = await this.findPublishedEntityBySlug(locale, slug);
    return this.approvedComments(post).map((comment) =>
      this.toCommentResponse(comment),
    );
  }

  async createComment(
    locale: BlogLocale,
    slug: string,
    dto: CreateBlogCommentDto,
  ): Promise<BlogCommentResponse> {
    const post = await this.findPublishedEntityBySlug(locale, slug);
    const comment = this.comments.create({
      post,
      author: this.sanitizeText(dto.author),
      body: this.sanitizeText(dto.body),
      approved: false,
    });

    return this.toCommentResponse(await this.comments.save(comment));
  }

  async createRating(
    locale: BlogLocale,
    slug: string,
    dto: CreateBlogRatingDto,
  ): Promise<{ rating: number; ratingCount: number }> {
    const post = await this.findPublishedEntityBySlug(locale, slug);
    const fingerprint = dto.fingerprint?.trim() || null;

    if (fingerprint) {
      const existing = await this.ratings.findOne({
        where: { post: { id: post.id }, fingerprint },
      });
      if (existing) throw new ConflictException('Rating already submitted');
    }

    await this.ratings.save(
      this.ratings.create({ post, value: dto.value, fingerprint }),
    );

    const total = post.ratingAverage * post.ratingCount + dto.value;
    post.ratingCount += 1;
    post.ratingAverage = Number((total / post.ratingCount).toFixed(2));
    const saved = await this.posts.save(post);

    return { rating: saved.ratingAverage, ratingCount: saved.ratingCount };
  }

  async recommendPost(
    locale: BlogLocale,
    slug: string,
    dto: CreateBlogRecommendationDto,
  ): Promise<{ recommended: true }> {
    const post = await this.findPublishedEntityBySlug(locale, slug);
    const fingerprint = dto.fingerprint?.trim() || null;

    if (fingerprint) {
      const existing = await this.recommendations.findOne({
        where: { post: { id: post.id }, fingerprint },
      });
      if (existing)
        throw new ConflictException('Recommendation already submitted');
    }

    await this.recommendations.save(
      this.recommendations.create({ post, fingerprint }),
    );

    return { recommended: true };
  }

  async seedInitialPosts(): Promise<{ posts: number; comments: number }> {
    const createdByKey = new Map<string, BlogPost>();

    for (const seed of blogSeedPosts) {
      const existing = await this.posts.findOne({
        where: { locale: seed.locale, slug: seed.slug },
      });
      const post = this.posts.create({
        ...(existing ?? {}),
        slug: seed.slug,
        locale: seed.locale,
        title: seed.title,
        excerpt: seed.excerpt,
        content: seed.content,
        publishedAt: new Date(`${seed.date}T00:00:00.000Z`),
        readingTime: seed.readingTime,
        category: seed.category,
        tags: seed.tags,
        cover: seed.cover,
        featured: seed.featured ?? false,
        ratingAverage: seed.rating,
        ratingCount: seed.ratingCount,
        status: seed.status,
      });
      const saved = await this.posts.save(post);
      createdByKey.set(this.seedKey(seed.locale, seed.slug), saved);
    }

    for (const seed of blogSeedPosts) {
      const post = createdByKey.get(this.seedKey(seed.locale, seed.slug));
      if (!post) continue;
      post.relatedPosts = seed.related
        .map((slug) => createdByKey.get(this.seedKey(seed.locale, slug)))
        .filter((related): related is BlogPost => Boolean(related));
      await this.posts.save(post);
    }

    let commentCount = 0;
    for (const seed of blogSeedPosts) {
      const post = createdByKey.get(this.seedKey(seed.locale, seed.slug));
      if (!post) continue;
      for (const seedComment of seed.comments) {
        const exists = await this.comments.findOne({
          where: { post: { id: post.id }, author: seedComment.author },
        });
        if (exists) continue;
        await this.comments.save(
          this.comments.create({
            post,
            author: seedComment.author,
            body: seedComment.body,
            approved: true,
            createdAt: new Date(`${seedComment.date}T00:00:00.000Z`),
          }),
        );
        commentCount += 1;
      }
    }

    return { posts: createdByKey.size, comments: commentCount };
  }

  async resetBlogContent(): Promise<{ deleted: true }> {
    await this.recommendations.createQueryBuilder().delete().execute();
    await this.ratings.createQueryBuilder().delete().execute();
    await this.comments.createQueryBuilder().delete().execute();
    await this.posts.createQueryBuilder().delete().execute();

    return { deleted: true };
  }

  private async findPublishedEntityBySlug(
    locale: BlogLocale,
    slug: string,
  ): Promise<BlogPost> {
    const post = await this.posts.findOne({
      where: { locale, slug, status: BlogPostStatus.PUBLISHED },
      relations: { comments: true, relatedPosts: true },
    });

    if (!post) {
      throw new NotFoundException(`Blog post ${locale}/${slug} not found`);
    }
    return post;
  }

  private toResponse(post: BlogPost): BlogPostResponse {
    return {
      id: post.id,
      slug: post.slug,
      locale: post.locale,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      date: this.dateOnly(post.publishedAt),
      publishedAt: post.publishedAt.toISOString(),
      readingTime: post.readingTime,
      category: post.category,
      tags: post.tags,
      cover: post.cover,
      featured: post.featured,
      rating: post.ratingAverage,
      ratingCount: post.ratingCount,
      related: (post.relatedPosts ?? []).map((relatedPost) => relatedPost.slug),
      comments: this.approvedComments(post).map((comment) =>
        this.toCommentResponse(comment),
      ),
      status: post.status,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  }

  private approvedComments(post: BlogPost): BlogComment[] {
    return (post.comments ?? [])
      .filter((comment) => comment.approved)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  private toCommentResponse(comment: BlogComment): BlogCommentResponse {
    return {
      id: comment.id,
      author: comment.author,
      body: comment.body,
      date: this.dateOnly(comment.createdAt),
    };
  }

  private dateOnly(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private sanitizeText(value: string): string {
    return value.replace(/\p{C}/gu, '').trim();
  }

  private seedKey(locale: BlogLocale, slug: string): string {
    return `${locale}:${slug}`;
  }
}
