import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import IconCopy from '@theme/Icon/Copy';
import IconSuccess from '@theme/Icon/Success';
import styles from './Cover.module.css';

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
 * Pure presentational cover: figure + image + AI-attribution footer.
 *
 * This component owns everything shared between contexts — the markup, the
 * copy button, the sparkles icon, the CSS module, and the all-fields-present
 * gate. It has no knowledge of where its data came from; the wrappers
 * (BlogCover / DocCover) resolve the data from their respective plugin hooks
 * and hand it in as plain props.
 *
 * The all-or-nothing gate is intentional: the blog-cover-prompt skill writes
 * these fields together, so their combined presence marks a finalized cover.
 * When a field is missing this returns `null` and lets the caller decide
 * whether that is silent (blog) or worth a visible warning (docs).
 *
 * @param {string} src        resolved image URL (already usable as <img src>)
 * @param {string} title      used as the image alt text
 * @param {string} imageModel generator name, shown in the collapsed footer
 * @param {string} imagePrompt prompt text revealed in the <details> disclosure
 * @param {string} imageStyle  gate only (consumed by the skill, not shown)
 */
export default function CoverFigure({
  src,
  title,
  imageModel,
  imagePrompt,
  imageStyle,
}) {
  // All-or-nothing gate: every field must exist or the block is skipped.
  if (!src || !imageModel || !imagePrompt || !imageStyle) {
    return null;
  }

  return (
    <figure className={styles.cover}>
      <img className={styles.image} src={src} alt={title} loading="lazy" />
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
