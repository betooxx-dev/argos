import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BlogPost } from './blog-post.entity';

@Entity('blog_comments')
export class BlogComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => BlogPost, (post) => post.comments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  post: BlogPost;

  @Column({ length: 80 })
  author: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ default: false })
  approved: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
