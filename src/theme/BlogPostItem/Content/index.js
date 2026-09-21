/**
 * Swizzled (ejected) BlogPostItem/Content.
 *
 * Identical to the stock theme component except that it renders <BlogCover />
 * before <MDXContent>. This places the automatic cover image + AI-attribution
 * footer at the top of the content region — below the title/metadata header,
 * above the post body — and only on the full blog-post page (BlogCover gates
 * on `isBlogPostPage` and the presence of all four cover frontmatter fields).
 */
import React from 'react';
import clsx from 'clsx';
import {blogPostContainerID} from '@docusaurus/utils-common';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import MDXContent from '@theme/MDXContent';
import BlogCover from '@site/src/components/BlogCover';

export default function BlogPostItemContent({children, className}) {
  const {isBlogPostPage} = useBlogPost();
  return (
    <div
      // This ID is used for the feed generation to locate the main content
      id={isBlogPostPage ? blogPostContainerID : undefined}
      className={clsx('markdown', className)}>
      <BlogCover />
      <MDXContent>{children}</MDXContent>
    </div>
  );
}
