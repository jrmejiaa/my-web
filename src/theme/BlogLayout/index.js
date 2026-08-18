import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import BlogSidebar from '@theme/BlogSidebar';
import styles from './styles.module.css';

/**
 * Swizzled BlogLayout.
 *
 * On a single blog *post* page (`isBlogPostPage`, set by the swizzled
 * BlogPostPage), use a doc-style two-column layout: main at 75% with the TOC at
 * col--3, and no Recent-posts sidebar. This lets the post body reach the same
 * ~1050px width as doc pages at wide viewports.
 *
 * For consistency the post body keeps the same ~1050px width whether or not it
 * has a TOC. With a TOC, main sits at 75% next to a col--3 TOC. Without a TOC,
 * there is no empty column: a single column of the same max-width is centered
 * in the container, so the content stays visually centered.
 *
 * Every other blog page (list, tag, author) is not a post page and keeps the
 * stock 3-column layout unchanged.
 */
export default function BlogLayout(props) {
  const {sidebar, toc, children, isBlogPostPage, ...layoutProps} = props;
  const hasSidebar = sidebar && sidebar.items.length > 0;
  return (
    <Layout {...layoutProps}>
      <div className="container margin-vert--lg">
        <div className="row">
          {isBlogPostPage ? (
            toc ? (
              <>
                <main className={clsx('col', styles.blogPostMainCol)}>
                  {children}
                </main>
                <div className="col col--3">{toc}</div>
              </>
            ) : (
              <main className={clsx('col', styles.blogPostMainColCentered)}>
                {children}
              </main>
            )
          ) : (
            <>
              <BlogSidebar sidebar={sidebar} />
              <main
                className={clsx('col', {
                  'col--9 col--offset-1': !hasSidebar,
                })}>
                {children}
              </main>
              {toc && <div className="col col--2">{toc}</div>}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
