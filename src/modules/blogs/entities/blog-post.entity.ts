import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BlogLocale, BlogPostStatus } from '../dto';
import { BlogComment } from './blog-comment.entity';
import { BlogRating } from './blog-rating.entity';
import { BlogRecommendation } from './blog-recommendation.entity';

const numberTransformer = {
  to: (value: number) => value,
  from: (value: string | number): number => Number(value),
};

@Entity('blog_posts')
@Index(['locale', 'slug'], { unique: true })
export class BlogPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 120 })
  slug: string;

  @Column({ type: 'enum', enum: BlogLocale })
  locale: BlogLocale;

  @Column({ length: 180 })
  title: string;

  @Column({ type: 'text' })
  excerpt: string;

  @Column({ type: 'jsonb' })
  content: string[];

  @Column({ type: 'timestamptz' })
  publishedAt: Date;

  @Column({ length: 40 })
  readingTime: string;

  @Column({ length: 80 })
  category: string;

  @Column({ type: 'simple-array', default: '' })
  tags: string[];

  @Column({ length: 255 })
  cover: string;

  @Column({ default: false })
  featured: boolean;

  @Column({
    type: 'numeric',
    precision: 3,
    scale: 2,
    default: 0,
    transformer: numberTransformer,
  })
  ratingAverage: number;

  @Column({ default: 0 })
  ratingCount: number;

  @Column({ type: 'enum', enum: BlogPostStatus, default: BlogPostStatus.DRAFT })
  status: BlogPostStatus;

  @ManyToMany(() => BlogPost)
  @JoinTable({
    name: 'blog_post_related_posts',
    joinColumn: { name: 'post_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'related_post_id', referencedColumnName: 'id' },
  })
  relatedPosts: BlogPost[];

  @OneToMany(() => BlogComment, (comment) => comment.post)
  comments: BlogComment[];

  @OneToMany(() => BlogRating, (rating) => rating.post)
  ratings: BlogRating[];

  @OneToMany(() => BlogRecommendation, (recommendation) => recommendation.post)
  recommendations: BlogRecommendation[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
