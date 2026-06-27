import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import type { Repository } from 'typeorm';

import { BlogsService } from './blogs.service';
import {
  BlogLocale,
  BlogPostStatus,
  CreateBlogCommentDto,
  CreateBlogRatingDto,
} from './dto';
import {
  BlogComment,
  BlogPost,
  BlogRating,
  BlogRecommendation,
} from './entities';

type EntityWithId = { id: string };
type WhereValue = string | number | boolean | object | null | undefined;

class FakeRepository<T extends EntityWithId> {
  constructor(public readonly items: T[] = []) {}

  find(options?: {
    where?: Record<string, WhereValue>;
    order?: Record<string, 'ASC' | 'DESC'>;
  }): Promise<T[]> {
    const result = this.items.filter((item) =>
      this.matches(item, options?.where),
    );
    const [orderKey, direction] = Object.entries(options?.order ?? {})[0] ?? [];
    if (!orderKey) return Promise.resolve(result);

    return Promise.resolve(
      [...result].sort((a, b) => {
        const left = this.valueOf(a, orderKey);
        const right = this.valueOf(b, orderKey);
        const diff = left > right ? 1 : left < right ? -1 : 0;
        return direction === 'DESC' ? diff * -1 : diff;
      }),
    );
  }

  findOne(options: { where?: Record<string, WhereValue> }): Promise<T | null> {
    return Promise.resolve(
      this.items.find((item) => this.matches(item, options.where)) ?? null,
    );
  }

  create(data: Partial<T>): T {
    return data as T;
  }

  save(entity: T): Promise<T> {
    if (!entity.id) entity.id = `id-${this.items.length + 1}`;
    const timestamped = entity as T & { createdAt?: Date; updatedAt?: Date };
    if (!timestamped.createdAt) timestamped.createdAt = new Date();
    timestamped.updatedAt = new Date();
    const index = this.items.findIndex((item) => item.id === entity.id);
    if (index >= 0) this.items[index] = entity;
    else this.items.push(entity);
    return Promise.resolve(entity);
  }

  createQueryBuilder() {
    return {
      delete: () => ({
        execute: () => {
          this.items.splice(0, this.items.length);
          return Promise.resolve();
        },
      }),
    };
  }

  private matches(item: T, where?: Record<string, WhereValue>): boolean {
    if (!where) return true;
    return Object.entries(where).every(([key, expected]) => {
      const actual = this.valueOf(item, key);
      if (expected && typeof expected === 'object' && 'id' in expected) {
        return this.valueOf(actual as EntityWithId, 'id') === expected.id;
      }
      return actual === expected;
    });
  }

  private valueOf(item: unknown, key: string): WhereValue {
    if (!item || typeof item !== 'object') return undefined;
    return (item as Record<string, WhereValue>)[key];
  }
}

const baseDate = new Date('2026-05-18T00:00:00.000Z');

function makePost(overrides: Partial<BlogPost>): BlogPost {
  return {
    id: overrides.id ?? `post-${overrides.slug ?? 'unknown'}`,
    slug: overrides.slug ?? 'designing-calm-software',
    locale: overrides.locale ?? BlogLocale.EN,
    title: overrides.title ?? 'Designing calm software',
    excerpt: overrides.excerpt ?? 'Excerpt',
    content: overrides.content ?? ['Paragraph'],
    publishedAt: overrides.publishedAt ?? baseDate,
    readingTime: overrides.readingTime ?? '6 min',
    category: overrides.category ?? 'Design',
    tags: overrides.tags ?? ['Design'],
    cover: overrides.cover ?? '/blog/calm-software.png',
    featured: overrides.featured ?? false,
    ratingAverage: overrides.ratingAverage ?? 4.8,
    ratingCount: overrides.ratingCount ?? 124,
    status: overrides.status ?? BlogPostStatus.PUBLISHED,
    relatedPosts: overrides.relatedPosts ?? [],
    comments: overrides.comments ?? [],
    ratings: [],
    recommendations: [],
    createdAt: overrides.createdAt ?? baseDate,
    updatedAt: overrides.updatedAt ?? baseDate,
  };
}

function makeComment(overrides: Partial<BlogComment>): BlogComment {
  return {
    id: overrides.id ?? 'comment-1',
    post: overrides.post as BlogPost,
    author: overrides.author ?? 'Mariana',
    body: overrides.body ?? 'Great post',
    approved: overrides.approved ?? true,
    createdAt: overrides.createdAt ?? baseDate,
  };
}

describe('BlogsService', () => {
  let posts: BlogPost[];
  let service: BlogsService;
  let commentRepo: FakeRepository<BlogComment>;

  beforeEach(() => {
    const related = makePost({
      id: 'post-related',
      slug: 'motion-that-means-something',
      tags: ['Motion', 'UX'],
    });
    const draftRelated = makePost({
      id: 'post-draft-related',
      slug: 'draft-related',
      status: BlogPostStatus.DRAFT,
    });
    const main = makePost({
      id: 'post-main',
      slug: 'designing-calm-software',
      tags: ['Design', 'UX'],
      relatedPosts: [related, draftRelated],
    });
    main.comments = [
      makeComment({ id: 'approved', post: main, approved: true }),
      makeComment({ id: 'pending', post: main, approved: false }),
    ];
    posts = [
      main,
      related,
      draftRelated,
      makePost({
        id: 'post-es',
        slug: 'disenar-software-tranquilo',
        locale: BlogLocale.ES,
        tags: ['Diseño'],
      }),
    ];
    commentRepo = new FakeRepository<BlogComment>();
    service = new BlogsService(
      new FakeRepository(posts) as unknown as Repository<BlogPost>,
      commentRepo as unknown as Repository<BlogComment>,
      new FakeRepository<BlogRating>() as unknown as Repository<BlogRating>,
      new FakeRepository<BlogRecommendation>() as unknown as Repository<BlogRecommendation>,
    );
  });

  it('obtiene solo posts publicados por locale', async () => {
    const result = await service.findPublishedByLocale(BlogLocale.EN);

    expect(result.map((post) => post.slug)).toEqual([
      'designing-calm-software',
      'motion-that-means-something',
    ]);
  });

  it('obtiene un post publicado por slug', async () => {
    const result = await service.findPublishedBySlug(
      BlogLocale.EN,
      'designing-calm-software',
    );

    expect(result.title).toBe('Designing calm software');
    expect(result.comments).toHaveLength(1);
  });

  it('deriva tags publicados por locale', async () => {
    await expect(service.getAllTags(BlogLocale.EN)).resolves.toEqual([
      'Design',
      'Motion',
      'UX',
    ]);
  });

  it('obtiene relacionados publicados y excluye drafts', async () => {
    const result = await service.getRelatedPosts(
      BlogLocale.EN,
      'designing-calm-software',
    );

    expect(result.map((post) => post.slug)).toEqual([
      'motion-that-means-something',
    ]);
  });

  it('crea comentarios pendientes de moderación', async () => {
    const result = await service.createComment(
      BlogLocale.EN,
      'designing-calm-software',
      { author: ' Ada ', body: ' Useful article ' },
    );

    expect(result).toMatchObject({ author: 'Ada', body: 'Useful article' });
    expect(commentRepo.items[0].approved).toBe(false);
  });
});

describe('blog DTO validation', () => {
  it('rechaza comentarios inválidos', async () => {
    const dto = plainToInstance(CreateBlogCommentDto, {
      author: 'A',
      body: '',
    });

    await expect(validate(dto)).resolves.toHaveLength(2);
  });

  it('rechaza ratings fuera de 1-5', async () => {
    const dto = plainToInstance(CreateBlogRatingDto, { value: 6 });

    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('value');
  });
});
