import React from 'react';
import Giscus from '@giscus/react';
import {useColorMode} from '@docusaurus/theme-common';

/**
 * Presentational comments thread.
 *
 * This is the shared core of the Comments module: it owns the Giscus
 * deployment config (repo, category, mapping…) and resolves the site theme via
 * `useColorMode`, so the thread always matches light/dark. It has no knowledge
 * of where it is rendered or whether it *should* be rendered — the per-context
 * wrappers (BlogComments / DocComments) own that gate and only mount this once
 * they've decided comments belong on the page.
 *
 * The interface is intentionally empty (zero props): theme is global and the
 * Giscus config is a single fixed deployment target, so there is nothing for a
 * caller to pass or get wrong.
 */
export default function CommentsThread() {
  const {colorMode} = useColorMode();

  // Dark mode: the default Giscus `dark` theme is GitHub's near-black
  // (#0d1117), which reads as a foreign box against our blue-dark palette
  // (#0b1120). `transparent_dark` drops the canvas background so the page
  // color shows through and the thread blends in. Light mode already matches,
  // so it stays on the stock `light` theme.
  const giscusTheme = colorMode === 'dark' ? 'transparent_dark' : 'light';

  return (
    <Giscus
      repo="jrmejiaa/my-web"
      repoId="R_kgDOKI92RA"
      category="General"
      categoryId="DIC_kwDOKI92RM4Ci7vS"
      mapping="url"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="1"
      inputPosition="top"
      theme={giscusTheme}
      lang="en"
      loading="lazy"
      crossorigin="anonymous"
      async
    />
  );
}
