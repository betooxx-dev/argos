import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BlogPost } from './blog-post.entity';

@Entity('blog_ratings')
@Index(['post', 'fingerprint'])
export class BlogRating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => BlogPost, (post) => post.ratings, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  post: BlogPost;

  @Column({ type: 'smallint' })
  value: number;

  @Column({ length: 128, nullable: true })
  fingerprint: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
