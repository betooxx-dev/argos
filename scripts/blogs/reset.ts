import { BlogsService } from '../../src/modules/blogs/blogs.service';
import { runCli } from '../api-keys/_bootstrap';

void runCli('BlogReset', async (app) => {
  const blogs = app.get(BlogsService);
  await blogs.resetBlogContent();
  console.log('Blog content reset.');
});
