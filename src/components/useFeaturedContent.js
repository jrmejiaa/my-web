import {usePluginData} from '@docusaurus/useGlobalData';

/**
 * Resolve an ordered list of featured permalinks against the Content index.
 *
 * The landing page decides *which* posts/docs are featured and in what order;
 * it holds only their permalinks. This hook turns that editorial selection into
 * display-ready records by looking each permalink up in the global data the
 * `content-index-plugin` publishes from frontmatter. The page never restates a
 * post's title, tags, date, or summary — those live in the content itself.
 *
 * Order is preserved: the returned array follows `permalinks`, so the first
 * entry is the one the page renders as the big featured card.
 *
 * Unresolved permalinks (a typo, a renamed slug, or a draft excluded from the
 * production build) are dropped. In development an unresolved permalink logs a
 * visible `console.warn` so an editorial mistake is caught immediately; in
 * production it degrades to silently omitting the card rather than breaking the
 * page. This mirrors the DocCover wrapper's dev-warn / prod-skip contract.
 *
 * @param {string[]} permalinks ordered permalinks to feature
 * @param {'posts' | 'docs'} kind which content index collection to resolve against
 * @returns {Array<object>} resolved records, in the given order, minus any misses
 */
export default function useFeaturedContent(permalinks, kind) {
  const index = usePluginData('content-index-plugin') ?? {posts: [], docs: []};
  const collection = index[kind] ?? [];

  const byPermalink = new Map(
    collection.map((item) => [item.permalink, item]),
  );

  return permalinks.flatMap((permalink) => {
    const item = byPermalink.get(permalink);
    if (!item) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn(
          `useFeaturedContent: no ${kind} entry found for featured ` +
            `permalink "${permalink}". It will not render. Check the ` +
            `permalink against the content's slug/path.`,
        );
      }
      return [];
    }
    return [item];
  });
}
