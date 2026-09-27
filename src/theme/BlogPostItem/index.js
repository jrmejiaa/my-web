import React from 'react';
import BlogPostItem from '@theme-original/BlogPostItem';
import {BlogComments} from '@site/src/components/Comments';

/**
 * Swizzled BlogPostItem.
 *
 * Renders the stock item, then the blog comments thread. The decision of
 * whether comments actually appear (post opted in via `enableComments`, and
 * this is the full post page) lives inside BlogComments, not here.
 */
export default function BlogPostItemWrapper(props) {
  return (
    <>
      <BlogPostItem {...props} />
      <BlogComments />
    </>
  );
}
