import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBlogSchema1782520000000 implements MigrationInterface {
  name = 'CreateBlogSchema1782520000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(
      `CREATE TYPE "public"."blog_posts_locale_enum" AS ENUM('es', 'en')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."blog_posts_status_enum" AS ENUM('draft', 'published')`,
    );
    await queryRunner.query(`
      CREATE TABLE "blog_posts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "slug" character varying(120) NOT NULL,
        "locale" "public"."blog_posts_locale_enum" NOT NULL,
        "title" character varying(180) NOT NULL,
        "excerpt" text NOT NULL,
        "content" jsonb NOT NULL,
        "publishedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "readingTime" character varying(40) NOT NULL,
        "category" character varying(80) NOT NULL,
        "tags" text NOT NULL DEFAULT '',
        "cover" character varying(255) NOT NULL,
        "featured" boolean NOT NULL DEFAULT false,
        "ratingAverage" numeric(3,2) NOT NULL DEFAULT '0',
        "ratingCount" integer NOT NULL DEFAULT 0,
        "status" "public"."blog_posts_status_enum" NOT NULL DEFAULT 'draft',
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_blog_posts_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_blog_posts_locale_slug" ON "blog_posts" ("locale", "slug")`,
    );
    await queryRunner.query(`
      CREATE TABLE "blog_comments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "author" character varying(80) NOT NULL,
        "body" text NOT NULL,
        "approved" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "postId" uuid NOT NULL,
        CONSTRAINT "PK_blog_comments_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "blog_ratings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "value" smallint NOT NULL,
        "fingerprint" character varying(128),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "postId" uuid NOT NULL,
        CONSTRAINT "PK_blog_ratings_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_blog_ratings_post_fingerprint" ON "blog_ratings" ("postId", "fingerprint")`,
    );
    await queryRunner.query(`
      CREATE TABLE "blog_recommendations" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "fingerprint" character varying(128),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "postId" uuid NOT NULL,
        CONSTRAINT "PK_blog_recommendations_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_blog_recommendations_post_fingerprint" ON "blog_recommendations" ("postId", "fingerprint")`,
    );
    await queryRunner.query(`
      CREATE TABLE "blog_post_related_posts" (
        "post_id" uuid NOT NULL,
        "related_post_id" uuid NOT NULL,
        CONSTRAINT "PK_blog_post_related_posts" PRIMARY KEY ("post_id", "related_post_id")
      )
    `);
    await queryRunner.query(
      `ALTER TABLE "blog_comments" ADD CONSTRAINT "FK_blog_comments_post" FOREIGN KEY ("postId") REFERENCES "blog_posts"("id") ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_ratings" ADD CONSTRAINT "FK_blog_ratings_post" FOREIGN KEY ("postId") REFERENCES "blog_posts"("id") ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_recommendations" ADD CONSTRAINT "FK_blog_recommendations_post" FOREIGN KEY ("postId") REFERENCES "blog_posts"("id") ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_post_related_posts" ADD CONSTRAINT "FK_blog_related_post" FOREIGN KEY ("post_id") REFERENCES "blog_posts"("id") ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_post_related_posts" ADD CONSTRAINT "FK_blog_related_related" FOREIGN KEY ("related_post_id") REFERENCES "blog_posts"("id") ON DELETE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blog_post_related_posts" DROP CONSTRAINT "FK_blog_related_related"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_post_related_posts" DROP CONSTRAINT "FK_blog_related_post"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_recommendations" DROP CONSTRAINT "FK_blog_recommendations_post"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_ratings" DROP CONSTRAINT "FK_blog_ratings_post"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_comments" DROP CONSTRAINT "FK_blog_comments_post"`,
    );
    await queryRunner.query(`DROP TABLE "blog_post_related_posts"`);
    await queryRunner.query(
      `DROP INDEX "IDX_blog_recommendations_post_fingerprint"`,
    );
    await queryRunner.query(`DROP TABLE "blog_recommendations"`);
    await queryRunner.query(`DROP INDEX "IDX_blog_ratings_post_fingerprint"`);
    await queryRunner.query(`DROP TABLE "blog_ratings"`);
    await queryRunner.query(`DROP TABLE "blog_comments"`);
    await queryRunner.query(`DROP INDEX "IDX_blog_posts_locale_slug"`);
    await queryRunner.query(`DROP TABLE "blog_posts"`);
    await queryRunner.query(`DROP TYPE "public"."blog_posts_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."blog_posts_locale_enum"`);
  }
}
