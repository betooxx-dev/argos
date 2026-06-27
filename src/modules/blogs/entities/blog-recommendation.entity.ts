import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BlogPost } from './blog-post.entity';

@Entity('blog_recommendations')
@Index(['post', 'fingerprint'])
export class BlogRecommendation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => BlogPost, (post) => post.recommendations, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  post: BlogPost;

  @Column({ length: 128, nullable: true })
  fingerprint: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
