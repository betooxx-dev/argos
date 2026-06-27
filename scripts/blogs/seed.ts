import { BlogsService } from '../../src/modules/blogs/blogs.service';
import { runCli } from '../api-keys/_bootstrap';

void runCli('BlogSeed', async (app) => {
  const blogs = app.get(BlogsService);
  const result = await blogs.seedInitialPosts();
  console.log(
    `Seeded ${result.posts} blog posts and ${result.comments} approved comments.`,
  );
});
