import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import IconCopy from '@theme/Icon/Copy';
import IconSuccess from '@theme/Icon/Success';
import styles from './BlogCover.module.css';

/**
 * Copy button for the prompt, reusing the same glyphs as the code-block copy
 * button (IconCopy / IconSuccess). It swaps to the success icon for ~1s after a
 * successful copy. The Clipboard API is only used on click (client-side), so
 * SSR is unaffected.
 */
function CopyPromptButton({text}) {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef(undefined);

  const onCopy = useCallback(() => {
    try {
      navigator.clipboard.writeText(text).then(() => {
        setIsCopied(true);
        timeoutRef.current = window.setTimeout(() => setIsCopied(false), 1000);
      });
    } catch {
      // Clipboard unavailable — fail silently.
    }
  }, [text]);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  return (
    <button
      type="button"
      className={clsx(styles.copyButton, isCopied && styles.copyButtonCopied)}
      aria-label={isCopied ? 'Copied' : 'Copy prompt'}
      title="Copy prompt"
      onClick={onCopy}>
      <span className={styles.copyButtonIcons} aria-hidden="true">
        <IconCopy className={styles.copyButtonIcon} />
        <IconSuccess className={styles.copyButtonSuccessIcon} />
      </span>
    </button>
  );
}

/**
 * Small inline "sparkles" glyph used as the disclosure marker for the
 * AI-attribution footer. It inherits `currentColor`, so it picks up the
 * themed accent color from the CSS module.
 */
function SparklesIcon() {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false">
      <path
        fill="currentColor"
        d="M12 2.5l1.6 4.3a5 5 0 0 0 2.9 2.9l4.3 1.6-4.3 1.6a5 5 0 0 0-2.9 2.9L12 21.1l-1.6-4.3a5 5 0 0 0-2.9-2.9L3.2 12.3l4.3-1.6a5 5 0 0 0 2.9-2.9L12 2.5z"
      />
      <path
        fill="currentColor"
        d="M18.5 2.5l.7 1.9a2.2 2.2 0 0 0 1.3 1.3l1.9.7-1.9.7a2.2 2.2 0 0 0-1.3 1.3l-.7 1.9-.7-1.9a2.2 2.2 0 0 0-1.3-1.3l-1.9-.7 1.9-.7a2.2 2.2 0 0 0 1.3-1.3l.7-1.9z"
      />
    </svg>
  );
}

/**
 * Automatic cover image + AI-attribution footer for blog posts.
 *
 * Rendering is fully driven by frontmatter and only happens when the post is a
 * full blog-post page AND all four cover fields are present:
 *   - `image`        — resolved here via the webpack-processed `assets.image`
 *   - `imageModel`   — shown in the collapsed footer ("Generated with …")
 *   - `imagePrompt`  — revealed in the <details> disclosure
 *   - `imageStyle`   — gate only (consumed by the blog-cover-prompt skill, not shown)
 *
 * The all-four requirement is intentional: the skill writes these fields
 * together, so their combined presence marks a finalized, skill-generated cover.
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
  const image = assets?.image;

  // All-or-nothing gate: every field must exist or the block is skipped.
  if (!image || !imageModel || !imagePrompt || !imageStyle) {
    return null;
  }

  return (
    <figure className={styles.cover}>
      <img
        className={styles.image}
        src={image}
        alt={metadata.title}
        loading="lazy"
      />
      <figcaption className={styles.caption}>
        <details className={styles.details}>
          <summary className={styles.summary}>
            <SparklesIcon />
            <span>AI Generated with {imageModel}</span>
          </summary>
          <p className={styles.prompt}>
            <CopyPromptButton text={imagePrompt} />
            {imagePrompt}
          </p>
        </details>
      </figcaption>
    </figure>
  );
}
