/**
 * Content index plugin.
 *
 * Republishes a small, display-ready slice of every published post and doc as
 * plugin global data, so pages can render content cards from the frontmatter
 * source of truth instead of hand-copied literals. It is the seam the landing
 * page's Featured content selection reads through (see `useFeaturedContent`).
 *
 * Why this exists: neither the blog nor the docs plugin exposes rich per-item
 * metadata (title, tags, date, description) to a custom page. The blog plugin
 * publishes no global data at all; the docs plugin publishes only
 * `{id, path, sidebar}` per doc. Both, however, hand the full metadata to the
 * `allContentLoaded` lifecycle via `allContent`, so a tiny local plugin can read
 * it there and publish exactly the fields cards need.
 *
 * Interface (global data shape), read via
 * `usePluginData('content-index-plugin')`:
 *
 *   {
 *     posts: [{ title, permalink, date, description, tags: string[] }],
 *     docs:  [{ title, permalink, section, description, tags: string[] }],
 *   }
 *
 * `section` is derived from the doc permalink (`/docs/yocto/…` -> `~/yocto/`);
 * it is not a frontmatter field. Tags are flattened to their labels because
 * that is all the cards render.
 */

const BLOG_PLUGIN = 'docusaurus-plugin-content-blog';
const DOCS_PLUGIN = 'docusaurus-plugin-content-docs';

/** Flatten Docusaurus tag objects ({label, permalink}) to plain labels. */
function tagLabels(tags) {
  return (tags ?? []).map((tag) => tag.label);
}

/**
 * Derive a shell-style section label from a doc permalink.
 * `/docs/yocto/how-to-…` -> `~/yocto/`. Falls back to `~/` if the permalink
 * has no section segment.
 */
function sectionFromPermalink(permalink) {
  const match = /^\/docs\/([^/]+)\//.exec(permalink);
  return match ? `~/${match[1]}/` : '~/';
}

module.exports = function contentIndexPlugin() {
  return {
    name: 'content-index-plugin',

    async allContentLoaded({allContent, actions}) {
      const blogPosts =
        allContent[BLOG_PLUGIN]?.default?.blogPosts ?? [];
      const posts = blogPosts.map(({metadata}) => ({
        title: metadata.title,
        permalink: metadata.permalink,
        date: metadata.date,
        description: metadata.description,
        tags: tagLabels(metadata.tags),
      }));

      const loadedVersions =
        allContent[DOCS_PLUGIN]?.default?.loadedVersions ?? [];
      const docs = loadedVersions
        .flatMap((version) => version.docs ?? [])
        .map((doc) => ({
          title: doc.title,
          permalink: doc.permalink,
          section: sectionFromPermalink(doc.permalink),
          description: doc.description,
          tags: tagLabels(doc.tags),
        }));

      actions.setGlobalData({posts, docs});
    },
  };
};
