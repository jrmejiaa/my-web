import React from 'react';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import CommentsThread from './CommentsThread';

/**
 * Comments for a tutorial/doc.
 *
 * Thin data wrapper around {@link CommentsThread}. It owns only the
 * docs-particular gate: comments show when the doc opts in
 * (`enableComments: true` in frontmatter). Opt-in is symmetric with the blog —
 * a doc without the flag (e.g. a section welcome/hub page) shows no thread.
 * All rendering and the Giscus config live in the core.
 */
export default function DocComments() {
  const {frontMatter} = useDoc();

  if (!frontMatter.enableComments) {
    return null;
  }

  return <CommentsThread />;
}
