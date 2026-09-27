import React from 'react';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import CommentsThread from './CommentsThread';

/**
 * Comments for a blog post.
 *
 * Thin data wrapper around {@link CommentsThread}. It owns only the
 * blog-particular gate: comments show when the post opts in
 * (`enableComments: true` in frontmatter) and only on the full post page, never
 * in the list/feed view. All rendering and the Giscus config live in the core.
 */
export default function BlogComments() {
  const {frontMatter, isBlogPostPage} = useBlogPost();

  if (!frontMatter.enableComments || !isBlogPostPage) {
    return null;
  }

  return <CommentsThread />;
}
