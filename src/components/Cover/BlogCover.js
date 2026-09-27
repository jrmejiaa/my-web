import React from 'react';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import CoverFigure from './CoverFigure';

/**
 * Automatic cover for a blog post.
 *
 * Thin data wrapper around {@link CoverFigure}. It owns only the
 * blog-particular concerns: reading `useBlogPost()`, bailing when this is not
 * the full post page (so nothing renders in the list/feed view), and resolving
 * the image via the webpack-processed `assets.image` (blog covers are
 * co-located `./cover.*` files). All rendering and the field gate live in
 * `CoverFigure`.
 */
export default function BlogCover() {
  const {metadata, frontMatter, assets, isBlogPostPage} = useBlogPost();

  // Only render on the full post page, never in the list/feed view.
  if (!isBlogPostPage) {
    return null;
  }

  const {imageModel, imagePrompt, imageStyle} = frontMatter;
  // `assets.image` is the webpack-resolved URL; `frontMatter.image` is the raw
  // "./…" string and must not be used as an <img src>.
  return (
    <CoverFigure
      src={assets?.image}
      title={metadata.title}
      imageModel={imageModel}
      imagePrompt={imagePrompt}
      imageStyle={imageStyle}
    />
  );
}
