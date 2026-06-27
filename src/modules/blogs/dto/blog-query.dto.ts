import { IsEnum, Matches } from 'class-validator';

export enum BlogLocale {
  ES = 'es',
  EN = 'en',
}

export enum BlogPostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

export class BlogLocaleQueryDto {
  @IsEnum(BlogLocale)
  locale: BlogLocale;
}

export class BlogPostParamsDto {
  @IsEnum(BlogLocale)
  locale: BlogLocale;

  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug: string;
}
